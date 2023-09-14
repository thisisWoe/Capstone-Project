import { Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
  private root!: am5.Root;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone) { }

  ngAfterViewInit() {
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
    let data = [{
      "date": new Date(2021, 0, 1).getTime(),
      "open": 1200,
      "high": 1205,
      "low": 1198,
      "close": 1202,
      // Altri dati simili per ciascun punto nel grafico
    }];

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
      fill: am5.color(0x76b041),
      stroke: am5.color(0x76b041)
    });
    series.columns.template.states.create("dropFromOpen", {
      fill: am5.color(0xe4572e),
      stroke: am5.color(0xe4572e)
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


  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  /*   ngAfterViewInit() {
      // Chart code goes in here
      this.browserOnly(() => {
        let root = am5.Root.new("chartdiv");

        root.setThemes([am5themes_Animated.new(root)]);

        let chart = root.container.children.push(
          am5xy.XYChart.new(root, {
            panY: false,
            layout: root.verticalLayout,
            wheelY: "zoomX",           // Abilita lo zoom sull'asse X usando la rotella del mouse
            layout: root.verticalLayout, // Utilizza un layout verticale
            maxtooltipDistance: 0      // Specifica la distanza massima per il tooltip (0 significa senza limite)
          })
        );

        // Define data
        let data = [
          {
            category: "Research",
            value1: 1000,
            value2: 588
          },
          {
            category: "Marketing",
            value1: 1200,
            value2: 1800
          },
          {
            category: "Sales",
            value1: 850,
            value2: 1230
          }
        ];

        // Create Y-axis
        let yAxis = chart.yAxes.push(
          am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {})
          })
        );

        // Create X-Axis
        let xAxis = chart.xAxes.push(
          am5xy.CategoryAxis.new(root, {
            renderer: am5xy.AxisRendererX.new(root, {}),
            categoryField: "category"
          })
        );
        xAxis.data.setAll(data);

        // Create series
        let series1 = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: "Series",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value1",
            categoryXField: "category"
          })
        );
        series1.data.setAll(data);

        let series2 = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: "Series",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value2",
            categoryXField: "category"
          })
        );
        series2.data.setAll(data);

        // Add legend
        let legend = chart.children.push(am5.Legend.new(root, {}));
        legend.data.setAll(chart.series.values);

        // Add cursor
        chart.set("cursor", am5xy.XYCursor.new(root, {}));

        this.root = root;
      });
    }

    ngOnDestroy() {
      // Clean up chart when the component is removed
      this.browserOnly(() => {
        if (this.root) {
          this.root.dispose();
        }
      });
    } */

}
