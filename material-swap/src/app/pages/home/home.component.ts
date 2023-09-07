import { Component, OnInit } from '@angular/core';
import { MarketDataService } from 'src/app/market-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  constructor(private marketSvc: MarketDataService) {}
  ngOnInit(): void {
    this.marketSvc.getDataBTC('BTC', 'USD').subscribe();
  }
}
