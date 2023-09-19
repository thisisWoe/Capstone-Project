import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import { Injectable } from '@angular/core';
import { Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as am5percent from "@amcharts/amcharts5/percent";
// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { IXYChartSettings } from '@amcharts/amcharts5/xy';
import { IChartData } from 'src/app/interfaces/ichart-data';

@Injectable({
  providedIn: 'root'
})
export class ChartServiceService {

  //proprietà da inserire nel costruttore
  constructor(/* @Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone */) { }

  chartInit(root: am5.Root, onOffPanY: boolean, zoom: IXYChartSettings["wheelY"]): am5xy.XYChart {
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        // Disabilita il panning sull'asse Y
        panY: onOffPanY,
        // Abilita lo zoom sull'asse X usando la rotella del mouse
        //wheelY: "zoomX",
        wheelY: zoom,
        // Utilizza un layout verticale
        layout: root.verticalLayout,
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

  xAxisBuild(root: am5.Root, chart: am5xy.XYChart): am5xy.DateAxis<am5xy.AxisRenderer> {
    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        tooltipDateFormat: "MMM d, yyyy",
        renderer: am5xy.AxisRendererX.new(root, {}),
        baseInterval: { timeUnit: "day", count: 1 }
      })
    );
    return xAxis;
  }

  yAxisBuild(root: am5.Root, chart: am5xy.XYChart): am5xy.ValueAxis<am5xy.AxisRenderer> {
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );
    return yAxis;
  }

  candleSeriesCreation(root: am5.Root, chart: am5xy.XYChart, xAxis: am5xy.DateAxis<am5xy.AxisRenderer>, yAxis: am5xy.ValueAxis<am5xy.AxisRenderer>): am5xy.CandlestickSeries {
    let series = chart.series.push(
      am5xy.CandlestickSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        openValueYField: "open",
        highValueYField: "high",
        lowValueYField: "low",
        valueYField: "close",
        valueXField: "date",
        // Impostazione del tooltip per la serie
        tooltip: am5.Tooltip.new(root, {})
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

  setPointer(root: am5.Root, chart: am5xy.XYChart, xAxis: am5xy.DateAxis<am5xy.AxisRenderer>) {
    chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "zoomXY",
      xAxis: xAxis
    }));
  }

  confirmSetting(root: am5.Root, arrayData: IChartData[], xAxis: am5xy.DateAxis<am5xy.AxisRenderer>, yAxis: am5xy.ValueAxis<am5xy.AxisRenderer>, series: am5xy.CandlestickSeries) {
    // Impostazione dei dati per la serie del grafico a candele
    series.data.setAll(arrayData);

    // Impostazione dei tooltip per gli assi X e Y del grafico
    xAxis.set("tooltip", am5.Tooltip.new(root, {
      themeTags: ["axis"]
    }));

    yAxis.set("tooltip", am5.Tooltip.new(root, {
      themeTags: ["axis"]
    }));
  }

  /* browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  } */


  //pieChart
  pieSetTheme(root: am5.Root) {
    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Dark.new(root),
    ])
  }

  pieCreateChart(root: am5.Root): am5percent.PieChart {
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        startAngle: 160,
        endAngle: 380
      })
    )
    return chart;
  }

  pieCreateSeries0(chart: am5percent.PieChart, root: am5.Root): am5percent.PieSeries {
    let series0 = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "targetPercentage",
        categoryField: "Asset",
        startAngle: 160,
        endAngle: 380,
        radius: am5.percent(70),
        innerRadius: am5.percent(65)
      })
    );
    return series0;
  }

  pieColorSet(root: am5.Root, series0: am5percent.PieSeries): am5.ColorSet {
    let colorSet = am5.ColorSet.new(root, {
      colors: [series0.get("colors")!.getIndex(0)],
      passOptions: {
        lightness: -0.05,
        hue: 0
      }
    });
    return colorSet;
  }

  pieCreateSeries1(chart: am5percent.PieChart, root: am5.Root): am5percent.PieSeries {
    let series1 = chart.series.push(
      am5percent.PieSeries.new(root, {
        startAngle: 160,
        endAngle: 380,
        valueField: "currentValue",
        innerRadius: am5.percent(80),
        categoryField: "Asset"
      })
    );
    return series1;
  }

  pieSetLabel(chart: am5percent.PieChart, root: am5.Root): am5.Label {
    let label = chart.seriesContainer.children.push(
      am5.Label.new(root, {
        textAlign: "center",
        centerY: am5.p100,
        centerX: am5.p50,
        text: "[fontSize:18px]Holdings[/]:\n[bold fontSize:30px]1647.9[/]"
      })
    );
    return label;
  }

  pieData(): object[] {
    let data = [
      /* {
        Asset: "Lithuania",
        litres: 501.9,
        bottles: 1500
      }, */
      {
        Asset: "BTC",
        currentValue: 26000, // Valore percentuale attuale
        targetPercentage: 500,
      },
      {
        Asset: "ETH",
        currentValue: 22000, // Valore percentuale attuale
        targetPercentage: 500,
      },
    ];
    return data;
  }
  pieSetAllChart(root: am5.Root) {
    this.pieSetTheme(root);
    const chart = this.pieCreateChart(root);
    const series0 = this.pieCreateSeries0(chart, root);
    const colorSet = this.pieColorSet(root, series0);
    const series1 = this.pieCreateSeries1(chart, root);
    const label = this.pieSetLabel(chart, root);
    const data = this.pieData();

    series0.set("colors", colorSet);

    series0.ticks.template.set("forceHidden", true);
    series0.labels.template.set("forceHidden", true);
    series1.ticks.template.set("forceHidden", true);
    series1.labels.template.set("forceHidden", true);
    series0.data.setAll(data);
    series1.data.setAll(data);
  }
























}
