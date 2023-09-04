import { Component, OnInit } from '@angular/core';
import Web3 from 'web3';
import { Web3Service } from './web3-serv/web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'material-swap';

  constructor(private web3Svc: Web3Service){}

  ngOnInit(): void {
    //sembra non servire, parte in automatico
    /* this.web3Svc.init(); */
  }


}
