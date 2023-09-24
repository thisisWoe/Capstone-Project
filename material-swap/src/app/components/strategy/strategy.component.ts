import { ICoinApiData } from './../../interfaces/icoin-api-data';
import { AfterViewInit, Component, ElementRef, Inject, NgZone, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { NgbAlertModule, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MarketDataService } from 'src/app/market-data.service';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from "@amcharts/amcharts5/percent";
import { ChartServiceService } from 'src/app/chart-service.service';
import { AuthService } from 'src/app/auth.service';
import { StrategyDto } from 'src/app/interfaces/strategy-dto';
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { IPricingBackend } from 'src/app/interfaces/ipricing-backend';
import * as am5xy from '@amcharts/amcharts5/xy';
import { IChartData } from 'src/app/interfaces/ichart-data';
import { Observable, Subject, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import Decimal from 'decimal.js';
import { IPieDataPercentage } from 'src/app/interfaces/ipie-data-percentage';
import { AssetAllocationDto } from 'src/app/interfaces/asset-allocation-dto';

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
  activeStrategy!:StrategyDto;
  targetAssetAllocations: Partial<AssetAllocationDto>[] = [];
  targetAssetName = '';

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


  constructor(private authSvc: AuthService, @Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone, private mktSvc: MarketDataService, private chartSvc: ChartServiceService) {

  }

  ngOnInit() {
    this.targetStrategy$.subscribe(value => {
      console.log("value target strategy:", value)
      this.activeStrategy = value;
      this.targetAssetAllocations = value.assetAllocations;
      this.targetAssetAllocations.forEach(asset => {
        if (asset.asset && asset.asset.id) {
          this.mktSvc.getSingleAsset(asset.asset.id).subscribe(assetFound => {
            console.log("assetFound:", assetFound)
            asset.asset!.name = assetFound.name;
            asset.asset!.imgUrl = assetFound.imgUrl;
          });
        }
      });

      this.getDataforCandle(value);
      this.getDataForPie(value);
      console.log(value.assetAllocations[0])
      this.getDataForLine(value, value.assetAllocations[0].asset.id!, value.assetAllocations[0].asset.name);
    })
    this.resizePage();
  }


  ngAfterViewInit(): void {
    this.getAllStrategiesByUserLogged();
    this.rootCandle = am5.Root.new("chartdivcandle");
    this.rootPie = am5.Root.new("chartdivpie");
    this.rootLine = am5.Root.new("chartdivline");
    /* this.buildPieChart(); */
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

  getAllStrategiesByUserLogged() {
    this.mktSvc.getStrategies(this.readUser())
      .subscribe(data => {
        console.log("data:", data)
        this.strategies = data;

        this.targetStrategy$.next(this.strategies[0]);

        /* this.generateChartData(data[0]); */
      })
  }

  onChangeStrategyTarget(event: Event) {
    const select = <HTMLSelectElement>event.target;
    const value = select.value;
    console.log("event:", value)
    const strategy = this.mktSvc.getSingleStrategy(Number(value))
      .subscribe(res => {
        this.targetStrategy$!.next(res);
        console.log("targetStrategy:", this.targetStrategy$)
        /* this.generateChartData(res); */
      })
  }

  roundNumber(n: number): number {
    let m = Number((Math.abs(n) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(n);
  }

  getDataforCandle(strategy: StrategyDto) {
    console.log('metodo getDataforCandle');

    const allocations = strategy.assetAllocations;
    const strategyStartDateString = strategy.start;
    const strategyStartDateDate = new Date(strategyStartDateString);
    console.log("strategyStartDateDate:", strategyStartDateDate)

    const objAssetPricingArray: Partial<IPricingBackend>[] = [];

    const observables = allocations.map(asset => {
      const amount = asset.amount;
      return this.mktSvc.getPriceFromBEbyAsset(asset.asset.id).pipe(
        // Filtra per ottenere solo i prezzi dalla data di inizio strategia
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

      // Ora objAssetPricingArray è stato riempito con tutti i dati necessari
      console.log("objAssetPricingArray:", objAssetPricingArray);

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
      // Convertiamo l'oggetto delle somme in un array
      const newSummedArray: Partial<IPricingBackend>[] = Object.values(dataSums);
      const chartData: Partial<IChartData>[] = [];
      console.log("newSummedArray:", newSummedArray);
      newSummedArray.forEach((objPrice: any) => {
        const date = objPrice.date;
        const dateNumber = new Date(date!);
        objPrice.date = dateNumber.getTime();
        objPrice.value = objPrice.close
        chartData.push(objPrice);
      })
      console.log("chartData:", chartData)
      chartData.sort((a, b) => a.date! - b.date!)
      this.buildCandleChart(chartData);

    });



  }

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
      //interno candela +
      fill: am5.color(0xbe6dab),
      //bordo candela +
      stroke: am5.color(0xbe6dab)
    });

    this.series.columns.template.states.create("dropFromOpen", {
      //interno candela -
      fill: am5.color(0x59118d),
      //bordo candela -
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

  /* getDataForPie(strategy: StrategyDto) {
    const allocations = strategy.assetAllocations;
    const pieChartObjS: any = [];

    allocations.forEach(assetAll => {
      const objChart = {
        asset: assetAll.asset.id,
        percentage: assetAll.percentage,
        actualPercentage: 0,
        amount: assetAll.amount,
      }
      pieChartObjS.push(objChart);
    })

    const temporaryArray: any = [];
    const chartData:IPieDataPercentage[] = [];
    pieChartObjS.forEach((asset: any) => {
      this.mktSvc.getPriceFromBEbyAsset(<number>asset.asset)
        .subscribe((pricing: any) => {
          let singlePrice = pricing[0];
          let lastObj = singlePrice;
          this.mktSvc.getSingleAsset(singlePrice.targetAsset.id)
            .subscribe(crypto => {

              for (let i = 1; i < pricing.length; i++) {
                const currentObj = pricing[i];
                const currentDate = new Date(currentObj.date);
                const lastObjDate = new Date(lastObj.date);

                if (currentDate > lastObjDate) {
                  lastObj = currentObj;
                }
              }

              const target = pricing.find((pricingTargetDate: any) => pricingTargetDate.date === lastObj.date)


              const objUpdated = {
                asset: crypto.name,
                percentage: asset.percentage,
                actualPercentage: lastObj.date,
                actualValue: target.close * asset.amount

              }
              console.log("objUpdated:", objUpdated)

              temporaryArray.push(objUpdated);
              console.log("temporaryArray:", temporaryArray)
              let summedValue = 0;
              temporaryArray.forEach((obj: any) => {
                summedValue += obj.actualValue;
              });
              temporaryArray.forEach((obj:any) => {
                const actualPercentage = (obj.actualValue * 100) / summedValue;

                const chartPieItem:IPieDataPercentage = {
                  asset: obj.asset,
                  percentage: obj.percentage,
                  actualPercentage: actualPercentage
                }
                chartData.push(chartPieItem);
              });
              console.log("chartData:", chartData)

            })
        })
    })

  } */

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
        // Restituisci solo l'oggetto con la data più recente
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
      console.log("results:", results);
      const chartData: IPieDataPercentage[] = [];
      let summedValue = 0;

      results.forEach((objUpdated: any) => {
        if (objUpdated) { // Assicurati che l'oggetto sia definito
          summedValue += objUpdated.actualValue;

          /* const actualPercentage = (objUpdated.actualValue * 100) / summedValue;

          const chartPieItem: IPieDataPercentage = {
            asset: objUpdated.asset,
            percentage: objUpdated.percentage,
            actualPercentage: actualPercentage,
          };
          chartData.push(chartPieItem); */
        }
      });
      results.forEach((objUpdated:any) => {
        const actualPercentage = (objUpdated.actualValue * 100) / summedValue;

          const chartPieItem: IPieDataPercentage = {
            asset: objUpdated.asset,
            percentage: objUpdated.percentage,
            actualPercentage: actualPercentage,
          };
          chartData.push(chartPieItem);
      });

      console.log("chartData:", chartData);
      this.buildPieChart(chartData, summedValue)
    });
  }

  buildPieChart(chartData:IPieDataPercentage[], total:number) {

    if (!this.chartPie) {
      this.rootPie.setThemes([
        am5themes_Animated.new(this.rootPie),
        am5themes_Dark.new(this.rootPie)
      ])

      /* this.chartPie = this.rootPie.container.children.push(
        am5xy.XYChart.new(this.rootPie, {
          wheelY: "zoomX"
        })
        ) */
      } else {
      this.rootPie.setThemes([
        am5themes_Animated.new(this.rootPie),
        am5themes_Dark.new(this.rootPie)
      ])


      this.series0Pie.data.clear();
      this.series1Pie.data.clear();
      this.series0Pie.chart?.series.clear();
      this.series1Pie.chart?.series.clear();
      /* this.chartPie = this.rootPie.container.children.push(
        am5xy.XYChart.new(this.rootPie, {
          wheelY: "zoomX"
        })
        ); */
      }


      /* this.rootPie = am5.Root.new("chartdivpie"); */


















    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    this.rootPie.setThemes([
      am5themes_Animated.new(this.rootPie),
      am5themes_Dark.new(this.rootPie)
    ]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
    this.chartPie = this.rootPie.container.children.push(
      am5percent.PieChart.new(this.rootPie, {
        startAngle: 160, endAngle: 380
      })
    );

    // Create series
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
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

    // Set data
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
    this.series0Pie.data.setAll(data);
    this.series1Pie.data.setAll(data);
  }

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
    console.log("data:", data)

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

    // Create axis ranges

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


    // Add cursor
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

  getDataForLine(strategy:StrategyDto, targetAssetAllocationId:number, name:string|undefined){
    console.log("name:", name)
    console.log("targetAssetAllocationId:", targetAssetAllocationId)
    console.log("strategy:", strategy)
    this.targetAssetName = <string>name;

    const allPricingData = [];
    const startStrategy = new Date(strategy.start);
    this.mktSvc.getPriceFromBEbyAsset(targetAssetAllocationId)
    .subscribe(data => {
      console.log("data:", data)
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
          date : (new Date(price_2.date)).getTime(),
          value : Number((price_2.close - objOlderPrice.close).toFixed(2))
        }
        chartData.push(objForChart);
      })
      this.buildLineChart(chartData)
    })

  }















  /*   resizeCandleChart() {
      const chart: HTMLDivElement = this.candleChartContainer.nativeElement;

      const width = chart.clientWidth;

      chart.style.height = `${width / 2.3}px`;

      const height = chart.clientHeight;
    }

    resizePieChart() {
      const chart: HTMLDivElement = this.pieChartContainer.nativeElement;
      console.log("chart:", chart)

      const width = chart.clientWidth;
      console.log("width:", width)

      chart.style.height = `${width}px`;

      const height = chart.clientHeight;
      console.log("height:", height)
    } */


}
