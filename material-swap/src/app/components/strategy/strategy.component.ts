import { ICoinApiData } from './../../interfaces/icoin-api-data';
import { AfterViewInit, Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild } from '@angular/core';
import { NgbAlertModule, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MarketDataService } from 'src/app/market-data.service';
import * as am5 from '@amcharts/amcharts5';
import { ChartServiceService } from 'src/app/chart-service.service';

@Component({
  selector: 'app-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.scss']
})
export class StrategyComponent implements AfterViewInit{

  @ViewChild('candleChartContainer', { static: true }) candleChartContainer!: ElementRef;
  @ViewChild('pieChartContainer', { static: true }) pieChartContainer!: ElementRef;

  /* model!: NgbDateStruct; */



  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone, private mktSvc: MarketDataService, private chartSvc :ChartServiceService){

  }


  ngAfterViewInit(): void {
    this.resizeCandleChart();
    const root = am5.Root.new("chartDivPieTarget");
    this.chartSvc.pieSetAllChart(root);
    this.resizePieChart();

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

  resizeCandleChart(){
    const chart:HTMLDivElement = this.candleChartContainer.nativeElement;

    const width = chart.clientWidth;

    chart.style.height = `${width / 2.3}px`;

    const height = chart.clientHeight;
  }

  resizePieChart(){
    const chart:HTMLDivElement = this.pieChartContainer.nativeElement;
    console.log("chart:", chart)

    const width = chart.clientWidth;
    console.log("width:", width)

    chart.style.height = `${width}px`;

    const height = chart.clientHeight;
    console.log("height:", height)
  }

}
