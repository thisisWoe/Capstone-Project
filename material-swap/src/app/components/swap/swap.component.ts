import { AfterViewInit, Component, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Web3Service } from 'src/app/web3-serv/web3.service';
import Web3 from 'web3';

@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss']
})
export class SwapComponent implements AfterViewInit, OnInit {
  @ViewChild('swap') private swapRef!: ElementRef;
  swapElement!: HTMLDivElement;
  @ViewChild('btnConnectSwap') private swapBtnRef!: ElementRef;
  swapBtnElement!: HTMLButtonElement;

  walletLogged: boolean = false;
  wallet$: Observable<any>;


  constructor(private web3Svc: Web3Service) {
    this.wallet$ = this.web3Svc.metamask$;
  }
  ngOnInit(): void {
    //this.checkConnection();
    this.wallet$.subscribe((wallet) => {
      this.walletLogged = wallet;
      console.log("🚀 ~ file: swap.component.ts:29 ~ SwapComponent ~ this.wallet$.subscribe ~ wallet:", wallet)
    });
  }

  ngAfterViewInit(): void {
    this.setDimension();
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

  connectMetamask() {
    this.web3Svc.connect();
  }


}
