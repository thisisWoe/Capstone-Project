import { Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { IXYChartSettings } from '@amcharts/amcharts5/xy';
import { IChartData } from 'src/app/interfaces/ichart-data';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
  private root!: am5.Root;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone) { }

  ngAfterViewInit() {

    this.root = am5.Root.new('chartDiv');
    // Impostazione del tema animato per il grafico
    this.root.setThemes([
      am5themes_Animated.new(this.root)
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
      {
        "date": new Date(2021, 0, 15).getTime(),
        "open": 1250,
        "high": 1300,
        "low": 1000,
        "close": 1050,
        // Altri dati simili per ciascun punto nel grafico
      },
    ];
    console.log(data);


    // Creazione dell'asse X del grafico
    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(this.root, {
        tooltipDateFormat: "MMM d, yyyy",
        renderer: am5xy.AxisRendererX.new(this.root, {}),
        baseInterval: { timeUnit: "day", count: 1 }
      })
    );

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
        tooltip: am5.Tooltip.new(this.root, {}) // Impostazione del tooltip per la serie
      })
    );

    // Impostazione dei colori per le candele in base alla loro variazione
    series.columns.template.states.create("riseFromOpen", {
      //interno candela +
      fill: am5.color(0xbe6dab),
      //bordo candela +
      stroke: am5.color(0xbe6dab)
    });
    series.columns.template.states.create("dropFromOpen", {
      //interno candela -
      fill: am5.color('#1f1739'),
      //bordo candela -
      stroke: am5.color('rgb(255, 255, 255)')
    });
    // Personalizzazione del testo del tooltip
    series.get("tooltip")!.label.set("text", "[bold]{valueX.formatDate()}[/]\nOpen: {openValueY}\nHigh: {highValueY}\nLow: {lowValueY}\nClose: {valueY}")

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
        tooltip: am5.Tooltip.new(this.root, {})
      })
    );
    return series;
  }

  colorCandleSettings(series: am5xy.CandlestickSeries, bodyPlus:string|number, bodyMinus:string|number, borderPlus?:string|number, borderMinus?:string|number){
    if(borderPlus && borderMinus){
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

  tooltip(series: am5xy.CandlestickSeries){
    series.get("tooltip")!.label.set("text", "[bold]{valueX.formatDate()}[/]\nOpen: {openValueY}\nHigh: {highValueY}\nLow: {lowValueY}\nClose: {valueY}")
  }

  setPointer(chart: am5xy.XYChart, xAxis: am5xy.DateAxis<am5xy.AxisRenderer>){
    chart.set("cursor", am5xy.XYCursor.new(this.root, {
      behavior: "zoomXY",
      xAxis: xAxis
    }));
  }

  confirmSetting(arrayData: IChartData[], xAxis: am5xy.DateAxis<am5xy.AxisRenderer>, yAxis: am5xy.ValueAxis<am5xy.AxisRenderer>, series: am5xy.CandlestickSeries){
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
}
