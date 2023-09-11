import { AfterViewInit, Component, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Web3Service } from 'src/app/web3-serv/web3.service';
import Web3 from 'web3';

@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss']
})
export class SwapComponent implements AfterViewInit {
  @ViewChild('swap') private swapRef!: ElementRef;
  swapElement!: HTMLDivElement;
  @ViewChild('btnConnectSwap') private swapBtnRef!: ElementRef;
  swapBtnElement!: HTMLButtonElement;



  constructor(private web3Svc: Web3Service) {

  }

  ngAfterViewInit(): void {
    this.setDimension();
    this.checkConnection();
    this.connectMetamask();
  }

  getSwapRef(): HTMLDivElement {
    return this.swapRef.nativeElement;
  }

  getSwapBtnRef(): HTMLButtonElement {
    return this.swapBtnRef.nativeElement;
  }

  setDimension() {
    if (window.innerWidth < 961) {
      this.swapElement = this.getSwapRef();
      console.log(window.innerWidth);

      this.swapElement.style.width = (window.innerWidth / 100) * 90 + 'px';
      this.swapElement.style.height = (window.innerWidth / 100) * 90 + 'px';
      console.log(this.swapElement.style.width);
      console.log(this.swapElement.style.height);

    } else {
      console.log('nothing changed');

    }
  }

  checkConnection() {
    console.log(this.web3Svc.checkConnection());


    //this.web3Svc.checkConnection().then(connection => {
    if (this.web3Svc.checkConnection() === true) {
      const buttonSwap: HTMLButtonElement = this.getSwapBtnRef();
      buttonSwap.textContent = 'Get Quotes';
    } else {
      const buttonSwap: HTMLButtonElement = this.getSwapBtnRef();
      buttonSwap.textContent = 'Connect Metamask';
    }
    //})
  }

  connectMetamask() {
    this.web3Svc.connect().then(web3 => {
      console.log(web3);
      console.log(web3.eth.getAccounts());
    })
  }


}
