import { Web3Service } from 'src/app/web3-serv/web3.service';
import { AfterViewInit, Component, ElementRef, Inject, NgZone, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { MarketDataService } from 'src/app/market-data.service';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from "@amcharts/amcharts5/percent";
import { AuthService } from 'src/app/auth.service';
import { StrategyDto } from 'src/app/interfaces/strategy-dto';
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { IPricingBackend } from 'src/app/interfaces/ipricing-backend';
import * as am5xy from '@amcharts/amcharts5/xy';
import { IChartData } from 'src/app/interfaces/ichart-data';
import { Subject, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { IPieDataPercentage } from 'src/app/interfaces/ipie-data-percentage';
import { AssetAllocationDto } from 'src/app/interfaces/asset-allocation-dto';
import { IAssetDto } from 'src/app/interfaces/iasset-dto';

@Component({
  selector: 'app-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.scss']
})
export class StrategyComponent implements AfterViewInit, OnInit {
  @ViewChild('pageContainer', { static: true }) pageContainer!: ElementRef;
  @ViewChild('candleChartContainer', { static: true }) candleChartContainer!: ElementRef;
  @ViewChild('pieChartContainer', { static: true }) pieChartContainer!: ElementRef;

  strategies: StrategyDto[] = [];
  targetStrategy$: Subject<StrategyDto> = new Subject<StrategyDto>();
  activeStrategy!: StrategyDto;
  targetAssetAllocations: Partial<AssetAllocationDto>[] = [];
  targetAssetName = '';

  allAssets: IAssetDto[] = [];

  rootCandle!: am5.Root;
  chart!: am5xy.XYChart;
  series!: am5xy.CandlestickSeries;
  scrollbarCandle!: am5xy.XYChartScrollbar;

  rootPie!: am5.Root;
  chartPie!: am5percent.PieChart;
  series0Pie!: am5percent.PieSeries;
  series1Pie!: am5percent.PieSeries;

  rootLine!: am5.Root;
  chartLine!: am5xy.XYChart;
  seriesLine!: am5xy.SmoothedXLineSeries;


  constructor(private web3Svc: Web3Service, private authSvc: AuthService, @Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone, private mktSvc: MarketDataService) {

  }

  ngOnInit() {
    // Sottoscrizione all'observable per ricevere la strategia target
    this.targetStrategy$.subscribe(value => {
      // Imposto la strategia attiva e ottengo i dati per i grafici
      this.activeStrategy = value;
      this.targetAssetAllocations = value.assetAllocations;
      this.targetAssetAllocations.forEach(asset => {
        if (asset.asset && asset.asset.id) {
          // Ottengo tutti gli asset e le reti disponibili
          this.mktSvc.getSingleAsset(asset.asset.id).subscribe(assetFound => {
            asset.asset!.name = assetFound.name;
            asset.asset!.imgUrl = assetFound.imgUrl;
          });
        }
      });
      if (this.activeStrategy.simulation) {
        const buttonRebalance = <HTMLButtonElement>document.querySelector('.btn-rebalance');
        buttonRebalance.setAttribute('disabled', 'disabled');
      } else {
        const buttonRebalance = <HTMLButtonElement>document.querySelector('.btn-rebalance');
        if (buttonRebalance.hasAttribute('disabled')) {
          buttonRebalance.removeAttribute('disabled');
        }
      }

      this.getDataforCandle(value);
      this.getDataForPie(value);
      this.getDataForLine(value, value.assetAllocations[0].asset.id!, value.assetAllocations[0].asset.name);
    })
    this.mktSvc.getAllAssetAndNetworks()
      .subscribe(res => {
        this.allAssets = res;
      })
    this.resizePage();
  }


  ngAfterViewInit(): void {
    // Ottengo tutte le strategie per l'utente loggato
    this.getAllStrategiesByUserLogged();
    // Inizializzo i grafici
    this.rootCandle = am5.Root.new("chartdivcandle");
    this.rootPie = am5.Root.new("chartdivpie");
    this.rootLine = am5.Root.new("chartdivline");
  }

  resizePage() {
    const pageContainer = this.pageContainer.nativeElement;
    pageContainer.style.height = this.authSvc.sizingRouterApp();
  }

  readUser(): string {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString!);
    return user.username;
  }

  // Metodo per ottenere tutte le strategie dell'utente loggato
  getAllStrategiesByUserLogged() {
    this.mktSvc.getStrategies(this.readUser())
      .subscribe(data => {
        this.strategies = data;

        this.targetStrategy$.next(this.strategies[0]);
      })
  }

  onChangeStrategyTarget(event: Event) {
    const select = <HTMLSelectElement>event.target;
    const value = select.value;
    const strategy = this.mktSvc.getSingleStrategy(Number(value))
      .subscribe(res => {
        this.targetStrategy$!.next(res);
      })
  }

  roundNumber(n: number): number {
    let m = Number((Math.abs(n) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(n);
  }
  //metodo per ricevere ed elaborare i dati per il grafico
  getDataforCandle(strategy: StrategyDto) {

    const allocations = strategy.assetAllocations;
    const strategyStartDateString = strategy.start;
    const strategyStartDateDate = new Date(strategyStartDateString);

    const objAssetPricingArray: Partial<IPricingBackend>[] = [];

    const observables = allocations.map(asset => {
      const amount = asset.amount;
      return this.mktSvc.getPriceFromBEbyAsset(asset.asset.id).pipe(
        map(res => res.map(pricingObj => {
          const date = new Date(pricingObj.date);
          return {
            ...pricingObj,
            open: pricingObj.open * amount,
            high: pricingObj.high * amount,
            low: pricingObj.low * amount,
            close: pricingObj.close * amount,
          };
        }).filter(pricingObj => {
          const date = new Date(pricingObj.date);
          return date >= strategyStartDateDate;
        }))
      );
    });


    forkJoin(observables).subscribe(pricingArrays => {
      pricingArrays.forEach(filteredPricingByStartDate => {
        filteredPricingByStartDate.forEach(asset => {
          const objAssetPricing: Partial<IPricingBackend> = {
            date: asset.date,
            open: asset.open,
            high: asset.high,
            low: asset.low,
            close: asset.close
          };
          objAssetPricingArray.push(objAssetPricing);
        });
      });

      const dataSums: { [date: string]: Partial<IPricingBackend> } = {};

      objAssetPricingArray.forEach(obj => {
        const date = obj.date;
        if (!dataSums[date!]) {
          dataSums[date!] = { date, open: 0, high: 0, low: 0, close: 0 };
        }
        dataSums[date!].open! += obj.open!;
        dataSums[date!].high! += obj.high!;
        dataSums[date!].low! += obj.low!;
        dataSums[date!].close! += obj.close!;
      });

      const newSummedArray: Partial<IPricingBackend>[] = Object.values(dataSums);
      const chartData: Partial<IChartData>[] = [];
      newSummedArray.forEach((objPrice: any) => {
        const date = objPrice.date;
        const dateNumber = new Date(date!);
        objPrice.date = dateNumber.getTime();
        objPrice.value = objPrice.close
        chartData.push(objPrice);
      })
      chartData.sort((a, b) => a.date! - b.date!)
      this.buildCandleChart(chartData);

    });



  }
  //construzione grafico
  buildCandleChart(chartData: Partial<IChartData>[]) {

    if (!this.chart) {
      this.rootCandle.setThemes([
        am5themes_Animated.new(this.rootCandle),
        am5themes_Dark.new(this.rootCandle)
      ])

      this.chart = this.rootCandle.container.children.push(
        am5xy.XYChart.new(this.rootCandle, {
          wheelY: "zoomX"
        })
      )
    } else {
      this.rootCandle.setThemes([
        am5themes_Animated.new(this.rootCandle),
        am5themes_Dark.new(this.rootCandle)
      ])

      this.series.data.clear();
      this.series.chart?.xAxes.clear();
      this.series.chart?.yAxes.clear();
      this.series.chart?.series.clear();
      this.series.chart?.remove("cursor")
      this.series.chart?.remove("scrollbarX")
      this.chart = this.rootCandle.container.children.push(
        am5xy.XYChart.new(this.rootCandle, {
          wheelY: "zoomX"
        })
      );
    }

    let data = chartData;

    this.chart = this.rootCandle.container.children.push(
      am5xy.XYChart.new(this.rootCandle, {
        focusable: true,
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX"
      })
    );

    let xAxis = this.chart.xAxes.push(
      am5xy.DateAxis.new(this.rootCandle, {
        groupData: true,
        maxDeviation: 0.5,
        baseInterval: { timeUnit: "day", count: 1 },
        renderer: am5xy.AxisRendererX.new(this.rootCandle, { pan: "zoom" }),
        tooltip: am5.Tooltip.new(this.rootCandle, {})
      })
    );

    let yAxis = this.chart.yAxes.push(
      am5xy.ValueAxis.new(this.rootCandle, {
        maxDeviation: 1,
        renderer: am5xy.AxisRendererY.new(this.rootCandle, { pan: "zoom" })
      })
    );

    let color = this.rootCandle.interfaceColors.get("background");

    this.series = this.chart.series.push(
      am5xy.CandlestickSeries.new(this.rootCandle, {
        fill: color,
        calculateAggregates: true,
        stroke: color,
        name: "MDXI",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        openValueYField: "open",
        lowValueYField: "low",
        highValueYField: "high",
        valueXField: "date",
        lowValueYGrouped: "low",
        highValueYGrouped: "high",
        openValueYGrouped: "open",
        valueYGrouped: "close",
        legendValueText:
          "open: {openValueY} low: {lowValueY} high: {highValueY} close: {valueY}",
        legendRangeValueText: "{valueYClose}",
        tooltip: am5.Tooltip.new(this.rootCandle, {
          pointerOrientation: "horizontal",
          labelText: "open: {openValueY}\nlow: {lowValueY}\nhigh: {highValueY}\nclose: {valueY}"
        })
      })
    );

    this.series.columns.template.states.create("riseFromOpen", {

      fill: am5.color(0xbe6dab),

      stroke: am5.color(0xbe6dab)
    });

    this.series.columns.template.states.create("dropFromOpen", {

      fill: am5.color(0x59118d),

      stroke: am5.color(0x59118d)
    });

    let cursor = this.chart.set(
      "cursor",
      am5xy.XYCursor.new(this.rootCandle, {
        xAxis: xAxis
      })
    );
    cursor.lineY.set("visible", false);

    this.chart.leftAxesContainer.set("layout", this.rootCandle.verticalLayout);

    this.scrollbarCandle = am5xy.XYChartScrollbar.new(this.rootCandle, {
      orientation: "horizontal",
      height: 50,
    });

    this.chart.set("scrollbarX", this.scrollbarCandle);

    let sbxAxis = this.scrollbarCandle.chart.xAxes.push(
      am5xy.DateAxis.new(this.rootCandle, {
        groupData: true,
        groupIntervals: [{ timeUnit: "week", count: 1 }],
        baseInterval: { timeUnit: "day", count: 1 },
        renderer: am5xy.AxisRendererX.new(this.rootCandle, {
          opposite: false,
          strokeOpacity: 0
        })
      })
    );

    let sbyAxis = this.scrollbarCandle.chart.yAxes.push(
      am5xy.ValueAxis.new(this.rootCandle, {
        renderer: am5xy.AxisRendererY.new(this.rootCandle, {})
      })
    );

    let sbseries = this.scrollbarCandle.chart.series.push(
      am5xy.LineSeries.new(this.rootCandle, {
        xAxis: sbxAxis,
        yAxis: sbyAxis,
        valueYField: "value",
        valueXField: "date"
      })
    );

    let legend = yAxis.axisHeader.children.push(am5.Legend.new(this.rootCandle, {}));

    legend.data.push(this.series);

    legend.markers.template.setAll({
      width: 10
    });

    legend.markerRectangles.template.setAll({
      cornerRadiusTR: 0,
      cornerRadiusBR: 0,
      cornerRadiusTL: 0,
      cornerRadiusBL: 0
    });

    this.series.data.setAll(data);
    sbseries.data.setAll(data);

    this.series.appear(1000);
    this.chart.appear(1000, 100);

  }
  //metodo per ricevere ed elaborare i dati per il grafico
  getDataForPie(strategy: StrategyDto) {
    const allocations = strategy.assetAllocations;
    const pieChartObjS: any[] = [];

    allocations.forEach(assetAll => {
      const objChart = {
        asset: assetAll.asset.id,
        percentage: assetAll.percentage,
        actualPercentage: 0,
        amount: assetAll.amount,
      };
      pieChartObjS.push(objChart);
    });

    const observables = pieChartObjS.map((asset: any) => {
      return this.mktSvc.getPriceFromBEbyAsset(asset.asset).pipe(
        switchMap(pricing => {
          const lastObj = pricing.reduce((prev: any, current: any) => {
            const currentDate = new Date(current.date);
            const prevDate = new Date(prev.date);
            return currentDate > prevDate ? current : prev;
          });

          return this.mktSvc.getSingleAsset(lastObj.targetAsset.id).pipe(
            map(crypto => {
              const objUpdated = {
                asset: crypto.name,
                percentage: asset.percentage,
                actualPercentage: lastObj.date,
                actualValue: lastObj.close * asset.amount,
              };
              return objUpdated;
            }),
            catchError(error => {
              console.error('Errore nell\'osservabile getSingleAsset:', error);
              return of(null);
            })
          );
        })
      );
    });

    forkJoin(observables).subscribe((results: any) => {
      const chartData: IPieDataPercentage[] = [];
      let summedValue = 0;

      results.forEach((objUpdated: any) => {
        if (objUpdated) {
          summedValue += objUpdated.actualValue;
        }
      });
      results.forEach((objUpdated: any) => {
        const actualPercentage = (objUpdated.actualValue * 100) / summedValue;

        const chartPieItem: IPieDataPercentage = {
          asset: objUpdated.asset,
          percentage: objUpdated.percentage,
          actualPercentage: actualPercentage,
          actualValue: objUpdated.actualValue
        };
        chartData.push(chartPieItem);
      });

      this.buildPieChart(chartData, summedValue);
      this.fillRebalance(strategy, chartData, summedValue);
    });
  }
  //construzione grafico
  buildPieChart(chartData: IPieDataPercentage[], total: number) {

    if (!this.chartPie) {
      this.rootPie.setThemes([
        am5themes_Animated.new(this.rootPie),
        am5themes_Dark.new(this.rootPie)
      ])

    } else {
      this.rootPie.setThemes([
        am5themes_Animated.new(this.rootPie),
        am5themes_Dark.new(this.rootPie)
      ])


      this.series0Pie.data.clear();
      this.series1Pie.data.clear();
      this.series0Pie.chart?.series.clear();
      this.series1Pie.chart?.series.clear();
      this.chartPie.seriesContainer.children.clear();

    }

    this.rootPie.setThemes([
      am5themes_Animated.new(this.rootPie),
      am5themes_Dark.new(this.rootPie)
    ]);

    this.chartPie = this.rootPie.container.children.push(
      am5percent.PieChart.new(this.rootPie, {
        startAngle: 160, endAngle: 380
      })
    );

    this.series0Pie = this.chartPie.series.push(
      am5percent.PieSeries.new(this.rootPie, {
        valueField: "percentage",
        categoryField: "asset",
        startAngle: 160,
        endAngle: 380,
        radius: am5.percent(70),
        innerRadius: am5.percent(65)
      })
    );

    let colorSet = am5.ColorSet.new(this.rootPie, {
      colors: [this.series0Pie.get("colors")!.getIndex(0)],
      passOptions: {
        lightness: -0.05,
        hue: 0
      }
    });

    this.series0Pie.set("colors", colorSet);

    this.series0Pie.ticks.template.set("forceHidden", true);
    this.series0Pie.labels.template.set("forceHidden", true);

    this.series1Pie = this.chartPie.series.push(
      am5percent.PieSeries.new(this.rootPie, {
        startAngle: 160,
        endAngle: 380,
        valueField: "actualPercentage",
        innerRadius: am5.percent(80),
        categoryField: "asset"
      })
    );

    this.series1Pie.ticks.template.set("forceHidden", true);
    this.series1Pie.labels.template.set("forceHidden", true);

    let label = this.chartPie.seriesContainer.children.push(
      am5.Label.new(this.rootPie, {
        textAlign: "center",
        centerY: am5.p100,
        centerX: am5.p50,
        text: `[fontSize:18px]total[/]:\n[bold fontSize:30px]${(total).toFixed(2)} $[/]`
      })
    );

    let data = chartData;

    this.series0Pie.data.setAll(data);
    this.series1Pie.data.setAll(data);
  }
  //construzione grafico
  buildLineChart(chartData: any) {

    if (!this.chartLine) {
      this.rootLine.setThemes([
        am5themes_Animated.new(this.rootLine),
        am5themes_Dark.new(this.rootLine)
      ])

      this.chartLine = this.rootLine.container.children.push(
        am5xy.XYChart.new(this.rootLine, {
          wheelY: "zoomX"
        })
      )
    } else {
      this.rootLine.setThemes([
        am5themes_Animated.new(this.rootLine),
        am5themes_Dark.new(this.rootLine)
      ])

      this.seriesLine.data.clear();
      this.seriesLine.chart?.xAxes.clear();
      this.seriesLine.chart?.yAxes.clear();
      this.seriesLine.chart?.series.clear();
      this.seriesLine.chart?.remove("cursor")
      this.chartLine = this.rootLine.container.children.push(
        am5xy.XYChart.new(this.rootLine, {
          wheelY: "zoomX"
        })
      );
    }

    let data = chartData;

    let yAxis = this.chartLine.yAxes.push(
      am5xy.ValueAxis.new(this.rootLine, {
        strictMinMax: true,
        extraTooltipPrecision: 1,
        renderer: am5xy.AxisRendererY.new(this.rootLine, {
          minGridDistance: 50
        })
      })
    );

    let xAxis = this.chartLine.xAxes.push(
      am5xy.DateAxis.new(this.rootLine, {
        baseInterval: { timeUnit: "day", count: 1 },
        renderer: am5xy.AxisRendererX.new(this.rootLine, {
          minGridDistance: 50,
          cellStartLocation: 0.2,
          cellEndLocation: 0.8,
        })
      })
    );

    this.seriesLine = this.chartLine.series.push(
      am5xy.SmoothedXLineSeries.new(this.rootLine, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(this.rootLine, {
          labelText: "{valueX.formatDate()}: {valueY}$",
          pointerOrientation: "horizontal"
        })
      })
    );

    this.seriesLine.strokes.template.setAll({
      stroke: am5.color(0x00ff00),
      strokeWidth: 3
    });

    this.seriesLine.fills.template.setAll({
      fillOpacity: 0.5,
      visible: true
    });

    this.seriesLine.data.setAll(data);

    let rangeDataItem = yAxis.makeDataItem({
      value: -1000,
      endValue: 0
    });

    let range = this.seriesLine.createAxisRange(rangeDataItem);

    range.strokes!.template.setAll({
      stroke: am5.color(0x59118d),
      strokeWidth: 3
    });

    range.fills!.template.setAll({
      fill: am5.color(0x59118d),
      fillOpacity: 0.5,
      visible: true,

    });

    this.chartLine.set(
      "cursor",
      am5xy.XYCursor.new(this.rootLine, {
        behavior: "zoomX",
        xAxis: xAxis
      })
    );

    xAxis.set(
      "tooltip",
      am5.Tooltip.new(this.rootLine, {
        themeTags: ["axis"]
      })
    );

    yAxis.set(
      "tooltip",
      am5.Tooltip.new(this.rootLine, {
        themeTags: ["axis"]
      })
    );

  }
  //metodo per ricevere ed elaborare i dati per il grafico
  getDataForLine(strategy: StrategyDto, targetAssetAllocationId: number, name: string | undefined) {
    this.targetAssetName = <string>name;

    const allPricingData = [];
    const startStrategy = new Date(strategy.start);
    this.mktSvc.getPriceFromBEbyAsset(targetAssetAllocationId)
      .subscribe(data => {
        const filteredArrayPerDate = data.filter(price => {
          const priceDate = new Date(price.date);
          return priceDate >= startStrategy;
        });
        filteredArrayPerDate.sort((a, b) => {
          const dateA = <number><unknown>new Date(a.date);
          const dateB = <number><unknown>new Date(b.date);
          return dateA - dateB;
        });
        const objOlderPrice = filteredArrayPerDate[0];
        const chartData: { date: number; value: number; }[] = [];
        filteredArrayPerDate.forEach(price_2 => {
          const objForChart = {
            date: (new Date(price_2.date)).getTime(),
            value: Number((price_2.close - objOlderPrice.close).toFixed(2))
          }
          chartData.push(objForChart);
        })
        this.buildLineChart(chartData)
      })

  }

  fillRebalance(strategy: StrategyDto, chartData: IPieDataPercentage[], total: number) {
    const allocations = strategy.assetAllocations;
    chartData.forEach(allocation => {
      const amountToSellOrBuy$ = (total / 100) * (allocation.percentage - allocation.actualPercentage);
      if (amountToSellOrBuy$ > 0) {
        const spanProfitLoss = <HTMLSpanElement>document.querySelector(`.span-${allocation.asset}`);
        spanProfitLoss!.textContent = 'Profit ';
        const spanToSellBuy = <HTMLSpanElement>document.querySelector(`.sell-buy-${allocation.asset}`);
        spanToSellBuy!.textContent = 'Sell ';
        spanProfitLoss!.style.backgroundColor = '#80b5db';
        spanToSellBuy!.style.backgroundColor = '#80b5db';
        spanProfitLoss!.style.color = '#000000';
        spanToSellBuy!.style.color = '#000000';

        const spanQuantity = <HTMLSpanElement>document.querySelector(`.quantity-${allocation.asset}`);
        const targetAssetAllocation = allocations.find(all => all.asset.name === allocation.asset);
        const pricePerUnitNow = allocation.actualValue / targetAssetAllocation!.amount;
        spanQuantity!.textContent = `${(amountToSellOrBuy$ / pricePerUnitNow)} ${allocation.asset} ~ ${amountToSellOrBuy$} $`;
        spanQuantity!.style.color = '#80b5db';

      } else {
        const spanProfitLoss = <HTMLSpanElement>document.querySelector(`.span-${allocation.asset}`);
        spanProfitLoss!.textContent = 'Loss ';
        const spanToSellBuy = <HTMLSpanElement>document.querySelector(`.sell-buy-${allocation.asset}`);
        spanToSellBuy!.textContent = 'Buy ';
        spanProfitLoss!.style.backgroundColor = '#59118d';
        spanToSellBuy!.style.backgroundColor = '#59118d';
        spanProfitLoss!.style.color = '#ffffff';
        spanToSellBuy!.style.color = '#ffffff';

        const spanQuantity = <HTMLSpanElement>document.querySelector(`.quantity-${allocation.asset}`);
        const targetAssetAllocation = allocations.find(all => all.asset.name === allocation.asset);
        const pricePerUnitNow = allocation.actualValue / targetAssetAllocation!.amount;
        spanQuantity!.textContent = `${(amountToSellOrBuy$ / pricePerUnitNow)} ${allocation.asset} ~ ${amountToSellOrBuy$} $`;
        spanQuantity!.style.color = '#be6dab';
      }
    })
  }

  // Metodo per avviare il rebalance del portafoglio
  rebalance() {
    const message = `Are you sure you want to rebalance your wallet? You will have to accept several transactions, so be sure you have enough ETH and WETH. WETH will serve beacuse every excess asset will be converted to WETH and then reconverted to target asset. Approximately the expected transaction fees should be: ${this.activeStrategy.assetAllocations.length * 0.3} $`;
    // Richiede la firma del messaggio al servizio Web3 per confermare il riequilibrio
    this.web3Svc.signRegisterRequestDynamicMessage(message)
      .then((response) => {

        const WETH = this.allAssets.find(asset => asset.id === 7);
        const netWETH = WETH?.addresses.find(address => address.networkName === 'arbitrum');

        const spanQuantities = document.querySelectorAll(`.span-to-find`);
        const assetToSwap: { amountToSwap: number; tokenFrom: string; tokenTo: string; }[] = [];

        spanQuantities.forEach(span => {
          const splittedSpan = span.textContent!.split(" ");
          const amount = Number(splittedSpan[0]);
          const assetName = splittedSpan[1];
          const asset = this.allAssets.find(asset => asset.name === assetName);
          const assetAddress = asset!.addresses.find(address => address.networkName === 'arbitrum');

          if (amount > 0) {
            const swapObj = {
              amountToSwap: amount,
              tokenFrom: assetAddress!.tokenAddress,
              tokenTo: netWETH!.tokenAddress,
            }
            if (swapObj.tokenFrom !== swapObj.tokenTo) {
              assetToSwap.push(swapObj);
            }
          } else {
            const swapObj = {
              amountToSwap: Math.abs(amount),
              tokenFrom: netWETH!.tokenAddress,
              tokenTo: assetAddress!.tokenAddress,
            }
            if (swapObj.tokenFrom !== swapObj.tokenTo) {
              assetToSwap.push(swapObj);
            }
          }
        })
        this.tryrebalance(assetToSwap);

      });
  }

  // Metodo per eseguire il rebalance effettivo del portafoglio
  async tryrebalance(swaps: { amountToSwap: number; tokenFrom: string; tokenTo: string; }[]) {
    const amount = Number((swaps[0].amountToSwap).toFixed(10));
    // Itero attraverso gli scambi necessari e provo ad eseguirli
    for (const swap of swaps) {
      try {
        // Ottengo il prezzo attuale per lo scambio
        await this.web3Svc.getPrice_V2(Number((swap.amountToSwap).toFixed(10)), swap.tokenFrom, swap.tokenTo, 'https://arbitrum.api.0x.org/swap/v1/')
          .subscribe(res => {
            const amountTrySwap = Number(res.sellAmount);
            this.web3Svc.trySwap_V2(Number((swap.amountToSwap).toFixed(10)), swap.tokenFrom, swap.tokenTo, 'https://arbitrum.api.0x.org/swap/v1/')
              .then((res) => {
                console.log("res:", res)
              });

          })
        console.log(`Scambio effettuato: ${swap.amountToSwap} ${swap.tokenFrom} -> ${swap.tokenTo}`);
      } catch (error) {
        console.error(`Errore durante lo scambio: ${error}`);
      }
    }
  }

  // Metodo per eliminare una strategia
  deleteStrategy(id: number) {
    this.mktSvc.deleteStrategy(id)
      .subscribe(res => {
        this.getAllStrategiesByUserLogged();
      })
  }

}
