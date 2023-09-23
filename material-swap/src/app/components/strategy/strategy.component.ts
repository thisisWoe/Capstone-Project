import { ICoinApiData } from './../../interfaces/icoin-api-data';
import { AfterViewInit, Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild } from '@angular/core';
import { NgbAlertModule, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MarketDataService } from 'src/app/market-data.service';
import * as am5 from '@amcharts/amcharts5';
import { ChartServiceService } from 'src/app/chart-service.service';
import { AuthService } from 'src/app/auth.service';
import { StrategyDto } from 'src/app/interfaces/strategy-dto';
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { IPricingBackend } from 'src/app/interfaces/ipricing-backend';
import * as am5xy from '@amcharts/amcharts5/xy';

@Component({
  selector: 'app-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.scss']
})
export class StrategyComponent implements AfterViewInit {
  @ViewChild('pageContainer', { static: true }) pageContainer!: ElementRef;
  @ViewChild('candleChartContainer', { static: true }) candleChartContainer!: ElementRef;
  @ViewChild('pieChartContainer', { static: true }) pieChartContainer!: ElementRef;

  strategies: StrategyDto[] = [];
  targetStrategy: StrategyDto | null = null;

  rootCandle!: am5.Root;
  rootPie!: am5.Root;
  chart!: am5xy.XYChart;
  series!: am5xy.SmoothedXLineSeries;


  constructor(private authSvc: AuthService, @Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone, private mktSvc: MarketDataService, private chartSvc: ChartServiceService) {

  }


  ngAfterViewInit(): void {
    this.getAllStrategiesByUserLogged();
    this.rootCandle = am5.Root.new("chartdivcandle");
    this.buildCandleChart()
    /* this.rootPie = am5.Root.new("chartdivpie"); */


    /* const root = am5.Root.new("chartDivPieTarget");
    this.chartSvc.pieSetAllChart(root); */
    /* this.resizeCandleChart(); */
    /* this.resizePieChart(); */

    /* this.mktSvc.getPeriodData('WBTC', 'USD', '2023-06-11', '2023-09-19').subscribe(data => {
      console.log("data:", data)
      const dataFromChart = this.mktSvc.transformDataforChart(data);
      const dataForBackend = this.mktSvc.transformDataforBackend(dataFromChart);
      console.log("dataForBackend:", dataForBackend)
      this.mktSvc.saveDataBackend(data).subscribe(res => {
        console.log("res:", res)

      });
    }); */

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
        /* this.generateChartData(data[0]); */
      })
  }

  onChangeStrategyTarget(event: Event) {
    const select = <HTMLSelectElement>event.target;
    const value = select.value;
    console.log("event:", value)
    const strategy = this.mktSvc.getSingleStrategy(Number(value))
      .subscribe(res => {
        console.log("res:", res)

        /* this.generateChartData(res); */
      })
  }

  buildCandleChart() {

    this.rootCandle.setThemes([
      am5themes_Animated.new(this.rootCandle),
      am5themes_Dark.new(this.rootCandle)
    ])

    function generateChartData() {
      let chartData = [];
      let firstDate = new Date();
      firstDate.setDate(firstDate.getDate() - 1000);
      firstDate.setHours(0, 0, 0, 0);
      let value = 1200;
      for (var i = 0; i < 5000; i++) {
        let newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + i);

        value += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
        let open = value + Math.round(Math.random() * 16 - 8);
        let low = Math.min(value, open) - Math.round(Math.random() * 5);
        let high = Math.max(value, open) + Math.round(Math.random() * 5);

        chartData.push({
          date: newDate.getTime(),
          value: value,
          open: open,
          low: low,
          high: high
        });
      }
      return chartData;
    }

    let data = generateChartData();

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = this.rootCandle.container.children.push(
      am5xy.XYChart.new(this.rootCandle, {
        focusable: true,
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX"
      })
    );

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(this.rootCandle, {
        groupData: true,
        maxDeviation: 0.5,
        baseInterval: { timeUnit: "day", count: 1 },
        renderer: am5xy.AxisRendererX.new(this.rootCandle, { pan: "zoom" }),
        tooltip: am5.Tooltip.new(this.rootCandle, {})
      })
    );

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.rootCandle, {
        maxDeviation: 1,
        renderer: am5xy.AxisRendererY.new(this.rootCandle, { pan: "zoom" })
      })
    );

    let color = this.rootCandle.interfaceColors.get("background");

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let series = chart.series.push(
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

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    let cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(this.rootCandle, {
        xAxis: xAxis
      })
    );
    cursor.lineY.set("visible", false);

    // Stack axes vertically
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Stacked_axes
    chart.leftAxesContainer.set("layout", this.rootCandle.verticalLayout);

    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    let scrollbar = am5xy.XYChartScrollbar.new(this.rootCandle, {
      orientation: "horizontal",
      height: 50
    });
    chart.set("scrollbarX", scrollbar);

    let sbxAxis = scrollbar.chart.xAxes.push(
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

    let sbyAxis = scrollbar.chart.yAxes.push(
      am5xy.ValueAxis.new(this.rootCandle, {
        renderer: am5xy.AxisRendererY.new(this.rootCandle, {})
      })
    );

    let sbseries = scrollbar.chart.series.push(
      am5xy.LineSeries.new(this.rootCandle, {
        xAxis: sbxAxis,
        yAxis: sbyAxis,
        valueYField: "value",
        valueXField: "date"
      })
    );

    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    let legend = yAxis.axisHeader.children.push(am5.Legend.new(this.rootCandle, {}));

    legend.data.push(series);

    legend.markers.template.setAll({
      width: 10
    });

    legend.markerRectangles.template.setAll({
      cornerRadiusTR: 0,
      cornerRadiusBR: 0,
      cornerRadiusTL: 0,
      cornerRadiusBL: 0
    });

    // set data
    series.data.setAll(data);
    sbseries.data.setAll(data);

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    chart.appear(1000, 100);

  }


















  resizeCandleChart() {
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
  }


}
