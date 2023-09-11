import { Component, OnInit } from '@angular/core';
import { MarketDataService } from 'src/app/market-data.service';
import { Web3Service } from 'src/app/web3-serv/web3.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  constructor(private marketSvc: MarketDataService, private web3Svc: Web3Service, ) {}
  ngOnInit(): void {
    /* this.marketSvc.getDataBTC('UNI', 'USD').subscribe(); */
    //this.web3Svc.connect();
    //this.web3Svc.checkConnection();
  }
}
