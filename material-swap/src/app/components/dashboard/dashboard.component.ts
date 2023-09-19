import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit, OnInit{
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

  constructor(private authSvc: AuthService){

  }


  ngOnInit(): void {
    this.insertStrategyData();
  }

  ngAfterViewInit(): void {
    this.resizeStrategyInfos();
    this.resizePage();
  }

  insertStrategyData(){
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

  resizePage(){
    const pageContainer = this.pageContainer.nativeElement;
    pageContainer.style.height = this.authSvc.sizingRouterApp();
  }

  resizeStrategyInfos(){
    const strategyInfosElement:HTMLDivElement = this.strategyInfos.nativeElement;
    const width = strategyInfosElement.offsetWidth;
    strategyInfosElement.style.height = width + 'px';
  }


}
