import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5percent from "@amcharts/amcharts5/percent";
// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import { IXYChartSettings } from '@amcharts/amcharts5/xy';
import { IChartData } from 'src/app/interfaces/ichart-data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit, OnInit {
  @ViewChild('pageContainer', { static: true }) pageContainer!: ElementRef;
  @ViewChild('strategyInfos', { static: true }) strategyInfos!: ElementRef;

  notSimulatedStrategy: any | null = {
    name: 'notSimulatedStrategy',
    simulation: false
  };

  strategies: any[] = [
    this.notSimulatedStrategy,
  ];

  simulatedStrategies: any = [];
  simulatedStrategiesProfitOrLoss: boolean = false;

  //chart
  root!: am5.Root;


  constructor(private authSvc: AuthService) {
  }


  ngOnInit(): void {
    this.insertStrategyData();
  }

  ngAfterViewInit(): void {
    this.root = am5.Root.new("chartdiv");
    this.buildChart(this.root);
    this.resizeStrategyInfos();
    this.resizePage();
  }

  buildChart(root: am5.Root) {
    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Dark.new(root)
    ])

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        wheelY: "zoomX"
      })
    );

    let data = this.generateChartData();

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        extraTooltipPrecision: 1,
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 30
        })
      })
    );

    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "day", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 50,
          cellStartLocation: 0.2,
          cellEndLocation: 0.8
        })
      })
    );

    let series = chart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "visits",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueX.formatDate()}: {valueY}",
          pointerOrientation: "horizontal"
        })
      })
    );

    series.strokes.template.setAll({
      strokeWidth: 3
    });

    series.fills.template.setAll({
      fillOpacity: 0.5,
      visible: true
    });

    series.data.setAll(data);

    // Create axis ranges

    let rangeDataItem = yAxis.makeDataItem({
      value: -1000,
      endValue: 0
    });

    let range = series.createAxisRange(rangeDataItem);

    range.strokes!.template.setAll({
      stroke: am5.color(0xff621f),
      strokeWidth: 3
    });

    range.fills!.template.setAll({
      fill: am5.color(0xff621f),
      fillOpacity: 0.5,
      visible: true
    });

    // Add cursor
    chart.set(
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

  generateChartData() {
    let chartData = [];
    let firstDate = new Date();
    firstDate.setDate(firstDate.getDate() - 150);
    let visits = -40;
    let b = 0.6;
    for (var i = 0; i < 150; i++) {
      let newDate = new Date(firstDate);
      newDate.setHours(0, 0, 0);
      newDate.setDate(newDate.getDate() + i);
      if (i > 80) {
        b = 0.4;
      }
      visits += Math.round((Math.random() < b ? 1 : -1) * Math.random() * 10);

      chartData.push({
        date: newDate.getTime(),
        visits: visits
      });
    }
    return chartData;
  }

  insertStrategyData() {
    if (this.strategies.length > 0) {
      this.strategies.forEach(strategy => {
        if (strategy.simulation === true) {
          this.simulatedStrategies.push(strategy);
        } else {
          this.notSimulatedStrategy = strategy;
        }
      });
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
}
