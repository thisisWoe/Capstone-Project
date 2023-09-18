import { MarketDataService } from 'src/app/market-data.service';
import { Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { IXYChartSettings } from '@amcharts/amcharts5/xy';
import { IChartData } from 'src/app/interfaces/ichart-data';
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
  private root!: am5.Root;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone, private mktSvc: MarketDataService) { }

  ngOnInit() {
    //this.getPeriodData('BTC', 'USD', '2023-09-10', '2023-09-15')
    /* this.mktSvc.getPeriodData('BTC', 'USD', '2023-09-15', '2023-09-16').subscribe(data => {
      console.log(data);


    }) */
    /* this.mktSvc.getDataNow('UNI', 'USD').subscribe(data => {
      console.log('UNI', data);
      const singleObj = data[0];
      this.mktSvc.transformData(singleObj);
    }) */
    /* this.mktSvc.getDataNow('LINK', 'USD').subscribe(data => {
      console.log('LINK', data);

    }) */
    /* this.mktSvc.getDataNow('BAL', 'USD').subscribe(data => {
      console.log('BAL', data);

    }) */
    /* this.mktSvc.getDataNow('DAI', 'USD').subscribe(data => {
      console.log('DAI', data);

    }) */
    /* this.mktSvc.getDataNow('SYN', 'USD').subscribe(data => {
      console.log('SYN', data);

    }) */
    /* this.getTodayData('BTC', 'USD'); */
  }

  ngAfterViewInit() {
    const grafico = <HTMLDivElement>document.querySelector('#chartDiv');
    const widthCh = grafico.offsetWidth;
    console.log("widthCh:", widthCh)

    this.root = am5.Root.new('chartDiv');
    // Impostazione del tema animato per il grafico
    this.root.setThemes([
      //https://www.amcharts.com/docs/v5/concepts/themes/#Modifying_default_theme
      am5themes_Animated.new(this.root),
      am5themes_Dark.new(this.root),
    ])

    // Creazione dell'oggetto "chart" che rappresenta il grafico principale
    let chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        panY: false,               // Disabilita il panning sull'asse Y
        //wheelY: "zoomX",           // Abilita lo zoom sull'asse X usando la rotella del mouse
        wheelY: "none",
        layout: this.root.verticalLayout, // Utilizza un layout verticale
        maxTooltipDistance: 0      // Specifica la distanza massima per il tooltip (0 significa senza limite)
      })
    )

    // Definizione dei dati del grafico a candele
    /* let dataProva = "2023-01-23T00:00:00.0000000Z";
    let dataData = new Date(dataProva);
    let timeStamp = dataData.getTime(); */
    let data = [
          {
            "date": new Date(2021, 0, 1).getTime(),
            //"date": timeStamp,
            "open": 1200,
            "high": 1810,
            "low": 1198,
            "close": 1800,
            // Altri dati simili per ciascun punto nel grafico
          },
          {
            "date": new Date(2021, 0, 2).getTime(),
            "open": 1250,
            "high": 1300,
            "low": 1000,
            "close": 1050,
            // Altri dati simili per ciascun punto nel grafico
          },
          {
            "date": new Date(2021, 0, 3).getTime(),
            "open": 1250,
            "high": 1300,
            "low": 1000,
            "close": 1050,
            // Altri dati simili per ciascun punto nel grafico
          },
          {
            "date": new Date(2021, 0, 4).getTime(),
            "open": 1250,
            "high": 1300,
            "low": 1000,
            "close": 1050,
            // Altri dati simili per ciascun punto nel grafico
          },
          {
            "date": new Date(2021, 0, 5).getTime(),
            "open": 1250,
            "high": 1300,
            "low": 1000,
            "close": 1050,
            // Altri dati simili per ciascun punto nel grafico
          },
          {
            "date": new Date(2021, 0, 6).getTime(),
            "open": 1250,
            "high": 1300,
            "low": 1000,
            "close": 1050,
            // Altri dati simili per ciascun punto nel grafico
          },
          {
            "date": new Date(2021, 0, 7).getTime(),
            "open": 1250,
            "high": 1300,
            "low": 1000,
            "close": 1050,
            // Altri dati simili per ciascun punto nel grafico
          },
          {
            "date": new Date(2021, 0, 8).getTime(),
            "open": 1250,
            "high": 1300,
            "low": 1000,
            "close": 1050,
            // Altri dati simili per ciascun punto nel grafico
          },
          {
            "date": new Date(2021, 0, 9).getTime(),
            "open": 1250,
            "high": 1300,
            "low": 1000,
            "close": 1050,
            // Altri dati simili per ciascun punto nel grafico
          },
          {
            "date": new Date(2021, 0, 10).getTime(),
            "open": 1250,
            "high": 1300,
            "low": 1000,
            "close": 1050,
            // Altri dati simili per ciascun punto nel grafico
          },
          {
            "date": new Date(2021, 0, 11).getTime(),
            "open": 1250,
            "high": 1300,
            "low": 1000,
            "close": 1050,
            // Altri dati simili per ciascun punto nel grafico
          },
          {
            "date": new Date(2021, 0, 12).getTime(),
            "open": 1250,
            "high": 1300,
            "low": 1000,
            "close": 1050,
            // Altri dati simili per ciascun punto nel grafico
          },
          {
            "date": new Date(2021, 0, 13).getTime(),
            "open": 1250,
            "high": 1300,
            "low": 1000,
            "close": 1050,
            // Altri dati simili per ciascun punto nel grafico
          },
          {
            "date": new Date(2021, 0, 14).getTime(),
            "open": 1250,
            "high": 1300,
            "low": 1000,
            "close": 1050,
            // Altri dati simili per ciascun punto nel grafico
          },
/*       {
        'close': 26610.980813233607,
        'date': new Date(2023, 8, 14).getTime(),
        'high': 27000.557887177958,
        'low': 26000.810285885258,
        'open': 26200.5626358898
        // Altri dati simili per ciascun punto nel grafico
      },
      {
        'close': 26000.980813233607,
        'date': new Date(2023, 8, 13).getTime(),
        'high': 26662.557887177958,
        'low': 25900.810285885258,
        'open': 26532.5626358898
        // Altri dati simili per ciascun punto nel grafico
      },
      {
        'close': 26603.980813233607,
        'date': new Date(2023, 8, 12).getTime(),
        'high': 26662.557887177958,
        'low': 26464.810285885258,
        'open': 26532.5626358898
        // Altri dati simili per ciascun punto nel grafico
      },
      {
        'close': 26603.980813233607,
        'date': 1694736000000,
        'high': 26662.557887177958,
        'low': 26464.810285885258,
        'open': 26532.5626358898
        // Altri dati simili per ciascun punto nel grafico
      }, */
    ];


    // Creazione dell'asse X del grafico
    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(this.root, {
        tooltipDateFormat: "MMM d, yyyy",
        renderer: am5xy.AxisRendererX.new(this.root, {
          stroke: am5.color(0xffffff),
        }),
        baseInterval: { timeUnit: "day", count: 1 },
      })
    );

    //xAxis.get('renderer').labels.template.adapters.add('fill') = am5.color("red");

    // Creazione dell'asse Y del grafico
    var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        renderer: am5xy.AxisRendererY.new(this.root, {})
      })
    );

    // Creazione della serie a candele
    let series = chart.series.push(
      am5xy.CandlestickSeries.new(this.root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        openValueYField: "open",
        highValueYField: "high",
        lowValueYField: "low",
        valueYField: "close",
        valueXField: "date",

        // Impostazione del tooltip per la serie
        /* tooltip: am5.Tooltip.new(this.root, {
          width: widthCh/5,
          height: (widthCh/5)/1.8,
        }) */
      })
    );

    // Impostazione dei colori per le candele in base alla loro variazione
    series.columns.template.states.create("riseFromOpen", {
      //interno candela +
      fill: am5.color(0xdd826d),
      //bordo candela +
      stroke: am5.color(0xdd826d)
    });
    series.columns.template.states.create("dropFromOpen", {
      //interno candela -
      fill: am5.color(0x645bbd),
      //bordo candela -
      stroke: am5.color(0x645bbd)
    });
    // Personalizzazione del testo del tooltip
    /* series.get("tooltip")!.label
      .set(
        "text",
        "[bold]{valueX.formatDate()}[/]\nOpen: {openValueY}\nHigh: {highValueY}\nLow: {lowValueY}\nClose: {valueY}"
      )

    series.get("tooltip")!.label
      .set("fontSize", 5) */


    // Impostazione dei dati per la serie del grafico a candele
    series.data.setAll(data);

    // Aggiunta di un cursore interattivo al grafico per il panning e lo zoom
    chart.set("cursor", am5xy.XYCursor.new(this.root, {
      behavior: "zoomXY",
      xAxis: xAxis
    }));

    // Impostazione dei tooltip per gli assi X e Y del grafico
    xAxis.set("tooltip", am5.Tooltip.new(this.root, {
      themeTags: ["axis"]
    }));

    yAxis.set("tooltip", am5.Tooltip.new(this.root, {
      themeTags: ["axis"]
    }));


  }

  //INIZIO

  chartInit(onOffPanY: boolean, zoom: IXYChartSettings["wheelY"]): am5xy.XYChart {
    let chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        // Disabilita il panning sull'asse Y
        panY: onOffPanY,
        // Abilita lo zoom sull'asse X usando la rotella del mouse
        //wheelY: "zoomX",
        wheelY: zoom,
        // Utilizza un layout verticale
        layout: this.root.verticalLayout,
        // Specifica la distanza massima per il tooltip (0 significa senza limite)
        maxTooltipDistance: 0
      })
    )
    return chart;
  }

  insertData(dataForChart: IChartData[]): IChartData[] {
    let data = dataForChart;
    return data;
  }

  xAxisBuild(chart: am5xy.XYChart): am5xy.DateAxis<am5xy.AxisRenderer> {
    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(this.root, {
        tooltipDateFormat: "MMM d, yyyy",
        renderer: am5xy.AxisRendererX.new(this.root, {}),
        baseInterval: { timeUnit: "day", count: 1 }
      })
    );
    return xAxis;
  }

  yAxisBuild(chart: am5xy.XYChart): am5xy.ValueAxis<am5xy.AxisRenderer> {
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        renderer: am5xy.AxisRendererY.new(this.root, {})
      })
    );
    return yAxis;
  }

  candleSeriesCreation(chart: am5xy.XYChart, xAxis: am5xy.DateAxis<am5xy.AxisRenderer>, yAxis: am5xy.ValueAxis<am5xy.AxisRenderer>): am5xy.CandlestickSeries {
    let series = chart.series.push(
      am5xy.CandlestickSeries.new(this.root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        openValueYField: "open",
        highValueYField: "high",
        lowValueYField: "low",
        valueYField: "close",
        valueXField: "date",
        // Impostazione del tooltip per la serie
        /* tooltip: am5.Tooltip.new(this.root, {}) */
      })
    );
    return series;
  }

  colorCandleSettings(series: am5xy.CandlestickSeries, bodyPlus: string | number, bodyMinus: string | number, borderPlus?: string | number, borderMinus?: string | number) {
    if (borderPlus && borderMinus) {
      series.columns.template.states.create("riseFromOpen", {
        fill: am5.color(bodyPlus),
        stroke: am5.color(borderPlus)
      });
      series.columns.template.states.create("dropFromOpen", {
        fill: am5.color(bodyMinus),
        stroke: am5.color(borderMinus)
      });
    } else {
      series.columns.template.states.create("riseFromOpen", {
        fill: am5.color(bodyPlus),
        stroke: am5.color(bodyPlus)
      });
      series.columns.template.states.create("dropFromOpen", {
        fill: am5.color(bodyMinus),
        stroke: am5.color(bodyMinus)
      });
    }
  }

  tooltip(series: am5xy.CandlestickSeries) {
    series.get("tooltip")!.label.set("text", "[bold]{valueX.formatDate()}[/]\nOpen: {openValueY}\nHigh: {highValueY}\nLow: {lowValueY}\nClose: {valueY}")
  }

  setPointer(chart: am5xy.XYChart, xAxis: am5xy.DateAxis<am5xy.AxisRenderer>) {
    chart.set("cursor", am5xy.XYCursor.new(this.root, {
      behavior: "zoomXY",
      xAxis: xAxis
    }));
  }

  confirmSetting(arrayData: IChartData[], xAxis: am5xy.DateAxis<am5xy.AxisRenderer>, yAxis: am5xy.ValueAxis<am5xy.AxisRenderer>, series: am5xy.CandlestickSeries) {
    // Impostazione dei dati per la serie del grafico a candele
    series.data.setAll(arrayData);

    // Impostazione dei tooltip per gli assi X e Y del grafico
    xAxis.set("tooltip", am5.Tooltip.new(this.root, {
      themeTags: ["axis"]
    }));

    yAxis.set("tooltip", am5.Tooltip.new(this.root, {
      themeTags: ["axis"]
    }));
  }



  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }



  //dati
  getTodayData(coin1: string, coin2: string) {
    this.mktSvc.getDataNow(coin1, coin2).subscribe(data => {
      console.log('dati trasformati', data);
      const singleObj = data[0];
      const singleObjTransformed = <IChartData>this.mktSvc.transformDataforChart(singleObj);
      console.log("singleObjTransformed:", singleObjTransformed)
    });
  }

  getPeriodData(coin1: string, coin2: string, startYYYY_MM_DD: string, endYYYY_MM_DD: string) {
    this.mktSvc.getPeriodData(coin1, coin2, startYYYY_MM_DD, endYYYY_MM_DD).subscribe(data => {
      const arrayTransformed = <IChartData[]>this.mktSvc.transformDataforChart(data);
      console.log("arrayTransformed:", arrayTransformed)
    })
  }
}
