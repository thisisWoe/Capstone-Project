import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { StrategyDto } from "src/app/interfaces/strategy-dto";
import { MarketDataService } from "src/app/market-data.service";
import { IAssetDto } from "src/app/interfaces/iasset-dto";
import { forkJoin, map } from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit, OnInit {
  @ViewChild('pageContainer', { static: true }) pageContainer!: ElementRef;
  @ViewChild('strategyInfos', { static: true }) strategyInfos!: ElementRef;

  strategies: StrategyDto[] = [];
  activeStrategy: StrategyDto | null = null;
  assetsOnActiveStrategy: string = '';

  simulatedStrategies: any = [];
  simulatedStrategiesProfitOrLoss: boolean = false;
  allAssets: IAssetDto[] = [];

  //form
  formStrategy!: FormGroup;
  currentStrategyToAdd: StrategyDto = {
    name: "",
    user: {
      publicKey: ""
    },
    simulation: false,
    assetAllocations: [],
    start: ""
  };
  errorPercentage = false;
  errorText = '';

  //chart
  root!: am5.Root | null;
  assetAllocations: { [key: string]: FormControl } = {};
  private chart!: am5xy.XYChart;
  private series!: am5xy.SmoothedXLineSeries;


  constructor(private authSvc: AuthService, private fb: FormBuilder, private calendar: NgbCalendar, private mktSvc: MarketDataService) {
  }


  ngOnInit(): void {
    // Ottengo tutti gli asset disponibili
    this.getAssets();
    // Inizializzo il form per aggiungere una nuova strategia con validazioni dei campi
    this.formStrategy = this.fb.group({
      name: ['', Validators.required],
      user: [this.readUser(), Validators.required],
      start: ['', Validators.required],
      simulation: [false, Validators.required],
      amount: [0, Validators.required]
    });

  }

  ngAfterViewInit(): void {
    this.root = am5.Root.new("chartdiv");
    // Ottengo tutte le strategie per l'utente loggato
    this.getAllStrategiesByUserLogged();
    this.resizePage();
  }

  readUser(): string {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString!);
    return user.username;
  }

  //Costruisco il grafico
  buildChart(root: am5.Root, chartData: any) {

    if (!this.chart) {
      root.setThemes([
        am5themes_Animated.new(root),
        am5themes_Dark.new(root)
      ])

      this.chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          wheelY: "zoomX"
        })
      )
    } else {
      root.setThemes([
        am5themes_Animated.new(root),
        am5themes_Dark.new(root)
      ])

      this.series.data.clear();
      this.series.chart?.xAxes.clear();
      this.series.chart?.yAxes.clear();
      this.series.chart?.series.clear();
      this.series.chart?.remove("cursor")
      this.chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          wheelY: "zoomX"
        })
      );
    }

    let data = chartData;
    console.log("data:", data)

    let yAxis = this.chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        extraTooltipPrecision: 1,
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 50
        })
      })
    );

    let xAxis = this.chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "day", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 50,
          cellStartLocation: 0.2,
          cellEndLocation: 0.8,
        })
      })
    );
    console.log(xAxis.dataItems)

    this.series = this.chart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueX.formatDate()}: {valueY}$",
          pointerOrientation: "horizontal"
        })
      })
    );

    this.series.strokes.template.setAll({
      stroke: am5.color(0x00ff00),
      strokeWidth: 3
    });

    this.series.fills.template.setAll({
      fillOpacity: 0.5,
      visible: true
    });

    this.series.data.setAll(data);

    // Create axis ranges

    let rangeDataItem = yAxis.makeDataItem({
      value: chartData[0].value,
      endValue: 0
    });

    let range = this.series.createAxisRange(rangeDataItem);

    range.strokes!.template.setAll({
      stroke: am5.color(0xff621f),
      strokeWidth: 3
    });

    range.fills!.template.setAll({
      fill: am5.color(0xff621f),
      fillOpacity: 0.5,
      visible: true,

    });


    // Add cursor
    this.chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "zoomX",
        xAxis: xAxis
      })
    );

    xAxis.set(
      "tooltip",
      am5.Tooltip.new(root, {
        themeTags: ["axis"]
      })
    );

    yAxis.set(
      "tooltip",
      am5.Tooltip.new(root, {
        themeTags: ["axis"]
      })
    );

  }

  // Metodo per convertire una data nel formato di stringa a timestamp
  fromDateStringToTimestamp(date: string): Date {
    const dateString = date;
    const dateParts = dateString.split("-");
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);
    const dateObj = new Date(year, month, day);
    return dateObj;
  }

  fromDateStringToNumber(date: string): number {
    const dateString = date;
    const dateParts = dateString.split("-");
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);
    const dateObj = new Date(year, month, day).getTime();
    return dateObj;
  }

  // Metodo per arrotondare un numero
  roundNumber(n: number): number {
    let m = Number((Math.abs(n) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(n);
  }

  onChangeStrategyTarget(event: Event) {
    const select = <HTMLSelectElement>event.target;
    const value = select.value;
    console.log("event:", value)
    const strategy = this.mktSvc.getSingleStrategy(Number(value))
      .subscribe(res => {
        console.log("res:", res)

        this.generateChartData(res);
      })
  }

  // Metodo per generare i dati del grafico
  generateChartData(strategy: StrategyDto) {
    let strategyTarget = strategy;
    console.log("strategyTarget:", strategyTarget)

    if (strategyTarget) {
      this.activeStrategy = strategyTarget;
      let chartData: { date: number; value: number; }[] = [];

      const allocations = strategyTarget.assetAllocations;
      allocations.forEach((allocation: any) => {
        this.assetsOnActiveStrategy += `${allocation.asset.name}: ${allocation.percentage}%, `;
      })


      // creo un array di observable per le chiamate HTTP
      const observables = allocations.map(asset => {
        const amount = asset.amount;
        return this.mktSvc.getPriceFromBEbyAsset(asset.asset.id).pipe(
          map(pricing => {

            const objPrice = pricing.map(pricePerDay => ({
              date: this.fromDateStringToNumber(pricePerDay.date),
              value: this.roundNumber(pricePerDay.open * amount)
            }));
            return objPrice;
          })
        );
      });

      // Usiamo forkJoin per attendere il completamento di tutte le chiamate
      forkJoin(observables).subscribe(pricesArray => {
        // Combina i risultati in un unico array
        const allObjPrice = pricesArray.reduce((accumulator, currentPrices) => {
          return accumulator.concat(currentPrices);
        }, []);

        // Uso la stessa logica di riduzione che ho usato prima
        chartData = allObjPrice.reduce((accumulator: any, currentObjPrice) => {
          const existingObjPrice: any = accumulator.find((obj: { date: number, value: number; }) => obj.date === currentObjPrice.date);

          if (existingObjPrice) {
            existingObjPrice.value += currentObjPrice.value;
          } else {
            accumulator.push({ date: currentObjPrice.date, value: currentObjPrice.value });
          }
          return accumulator;
        }, []);

        chartData.sort((a, b) => a.date - b.date);
        this.buildChart(this.root!, chartData);
        console.log("chartData:", chartData);
      });
      return chartData;

    } else {
      return null;
    }

  }

  resizePage() {
    const pageContainer = this.pageContainer.nativeElement;
    pageContainer.style.height = this.authSvc.sizingRouterApp();
  }

  resizeStrategyInfos() {
    const strategyInfosElement: HTMLDivElement = this.strategyInfos.nativeElement;
    const width = strategyInfosElement.offsetWidth;
    strategyInfosElement.style.height = width + 'px';
  }

  addDaysToDate(dateString: string, daysToAdd: number) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().slice(0, 10);
  }

  postStrategy() {
    console.log("this.formStrategy.value:", this.formStrategy.value)

    if (this.errorPercentage) {
      this.errorPercentage = false;
      this.errorText = '';
    }
    if (this.formStrategy.value.name === '') {
      this.errorPercentage = true;
      this.errorText = 'Please enter a name for this strategy.';
    } else {
      if (this.formStrategy.value.start === '') {
        this.errorPercentage = true;
        this.errorText = 'Please choose a date.';
      } else {
        const datePlus1 = this.addDaysToDate(this.formatDate(this.formStrategy.value.start), 1);
        this.formStrategy.value.start = this.formatDate(this.formStrategy.value.start);
        if (this.formStrategy.value.amount === 0) {
          this.errorPercentage = true;
          this.errorText = 'Please select amount.';
        } else {
          this.currentStrategyToAdd.name = this.formStrategy.value.name;
          this.currentStrategyToAdd.simulation = this.formStrategy.value.simulation;
          this.currentStrategyToAdd.start = this.formStrategy.value.start;
          this.currentStrategyToAdd.user.publicKey = this.formStrategy.value.user;

          const observables = this.allAssets.map(asset => {
            const assetName = asset.name;
            const targetInput = <HTMLInputElement>document.getElementById(`customRange${assetName}`);
            let percentage: string | number = targetInput.value;
            if (targetInput.value === '') {
              percentage = 50;
            }

            return this.mktSvc.getPriceFromBEbyAsset(asset.id!).pipe(
              map(data => {
                const objXday = data.find(objDay => {
                  return objDay.date === this.currentStrategyToAdd.start;
                });

                const percentageN = Number(percentage);
                const calculateAmount = ((this.formStrategy.value.amount / 100) * Number(percentage));
                const res = calculateAmount / objXday!.open;
                const assetId: number = asset.id || 0;

                return {
                  percentage: Number(percentage),
                  buyValue: objXday!.open,
                  amount: res,
                  asset: {
                    id: assetId
                  },
                  strategy: {
                    id: 1
                  }
                };
              })
            );
          });

          forkJoin(observables).subscribe(assetAllocations => {
            const filteredAssetAllocations = assetAllocations.filter(allocation => allocation.percentage > 0);
            let totalPercentage = 0;
            filteredAssetAllocations.forEach(all => {
              const perc = all.percentage;
              totalPercentage += perc;
            })
            if (totalPercentage > 100 || totalPercentage <= 99) {
              this.errorPercentage = true;
              this.errorText = 'Sum of the percentages must be 100. Actual: ' + totalPercentage + '%';
            } else {
              this.currentStrategyToAdd.assetAllocations = filteredAssetAllocations;
              this.mktSvc.postStrategy(this.currentStrategyToAdd).subscribe(data => {
                console.log("data:", data);
                this.formStrategy.reset();
                this.getAllStrategiesByUserLogged();
              });
            }

          });
        }
      }
    }
  }

  formatDate(dateObj: { year: number, month: number, day: number }): string {
    const { year, month, day } = dateObj;
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
    console.log(formattedDate);
    return formattedDate;
  }

  async getAssets() {
    this.mktSvc.getAllAssetAndNetworks()
      .subscribe(async assets => {
        console.log("assets:", assets)
        this.allAssets = assets;
      });
  }

  onRangeChange(event: any, assetName: string) {
    const targetInput = <HTMLInputElement>document.querySelector(`.customRange${assetName}`);
    targetInput.value = event.target.value;
  }

  onTextChange(event: any, assetName: string) {
    const targetInput = <HTMLInputElement>document.getElementById(`customRange${assetName}`);
    targetInput.value = event.target.value;

  }
  getAllStrategiesByUserLogged() {
    this.mktSvc.getStrategies(this.readUser())
      .subscribe(data => {
        console.log("data:", data)
        this.strategies = data;
        this.generateChartData(data[0]);
      })
  }

}
