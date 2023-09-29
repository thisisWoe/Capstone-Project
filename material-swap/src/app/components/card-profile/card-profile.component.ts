import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import anime from 'animejs/lib/anime.es.js';
import { Observable } from 'rxjs';
import { Web3Service } from 'src/app/web3-serv/web3.service';
import Web3 from 'web3';
import { IAssetDto } from 'src/app/interfaces/iasset-dto';
import { MarketDataService } from 'src/app/market-data.service';



@Component({
  selector: 'app-card-profile',
  templateUrl: './card-profile.component.html',
  styleUrls: ['./card-profile.component.scss']
})
export class CardProfileComponent implements OnInit {
  @ViewChild('animatedImg', { static: true }) animatedElement!: ElementRef;
  @ViewChild('caption', { static: true }) captionSpan!: ElementRef;
  @ViewChild('info', { static: true }) infos!: ElementRef;
  @ViewChild('infosConnect', { static: true }) infosConnect!: ElementRef;

  walletInfo: any;
  wallet$: Observable<any>;
  accountConnected!: string;

  networkString$: Observable<string | null>;
  networkSwappable: string | undefined;

  tokenInfoArray: any[] = [];

  cryptosList: IAssetDto[] = [];

  constructor(private web3Svc: Web3Service, private mktSvc: MarketDataService) {
    this.wallet$ = this.web3Svc.metamask$;
    this.networkString$ = this.web3Svc.network$
  }

  ngOnInit(): void {
    // Ottengo i dati relativi agli asset
    this.getAssetData();

    this.wallet$.subscribe((wallet) => {
      if (wallet) {
        this.walletInfo = wallet;
        this.accountConnected = this.walletInfo.selectedAddress;
        this.networkString$.subscribe((network) => {
          if (network) {
            this.networkSwappable = network!.toLowerCase();
            this.retrieveWalletData();
          }

        });
      }
    })
  }

  //animazione
  zoomAndMove(event: MouseEvent) {
    const element = this.animatedElement.nativeElement;
    anime({
      targets: element,
      delay: 0,
      keyframes: [
        {
          opacity: 0.05,
          translateY: 190,
          translateX: 150,
          scale: 2,
        }
      ],
      duration: 1000,
      easing: 'linear',
      loop: false
    });

    const span = this.captionSpan.nativeElement;
    anime({
      targets: span,
      delay: 0,
      keyframes: [
        {
          opacity: 0.05,
          translateX: 300,
        }
      ],
      duration: 500,
      easing: 'linear',
      loop: false
    });

    if (this.walletInfo) {
      const info = document.querySelector('.infoContainer');
      const infoWrapper: NodeListOf<HTMLDivElement> = document.querySelectorAll('.infoWrapper');
      infoWrapper.forEach((i: HTMLDivElement) => {
        if (i.offsetWidth === 0) {
          i.style.display = 'none';
        }

      });
      anime({
        targets: info,
        delay: 0,
        keyframes: [
          {
            opacity: 1,
            translateX: 509,
          }
        ],
        duration: 500,
        easing: 'linear',
        loop: false
      });
    } else {
      const info = document.querySelector('.infoContainer');
      anime({
        targets: info,
        delay: 0,
        keyframes: [
          {
            opacity: 1,
            translateX: 500,
          }
        ],
        duration: 500,
        easing: 'linear',
        loop: false
      });

    }
  }

  //animazione
  zoomAndMoveBack(e: MouseEvent) {
    const element = this.animatedElement.nativeElement;
    anime({
      targets: element,
      delay: 0,
      keyframes: [
        {
          opacity: 1,
          translateY: 0,
          translateX: 0,
          scale: 1,
        }
      ],
      duration: 1000,
      easing: 'linear',
      loop: false
    });
    const span = this.captionSpan.nativeElement;
    anime({
      targets: span,
      delay: 0,
      keyframes: [
        {
          opacity: 1,
          translateX: -0,
        }
      ],
      duration: 500,
      easing: 'linear',
      loop: false
    });
    if (this.walletInfo) {
      const info = document.querySelector('.infoContainer');
      anime({
        targets: info,
        delay: 0,
        keyframes: [
          {
            opacity: 1,
            translateX: 0,
          }
        ],
        duration: 500,
        easing: 'linear',
        loop: false
      });
    } else {
      const info = document.querySelector('.infoContainer');
      anime({
        targets: info,
        delay: 0,
        keyframes: [
          {
            opacity: 1,
            translateX: 0,
          }
        ],
        duration: 500,
        easing: 'linear',
        loop: false
      });

    }
  }

  // Metodo per recuperare i dati del portafoglio
  async retrieveWalletData() {
    const tokenArray: any[] = [];
    const tokenArrayName: string[] = [];
    // Carica l'ABI del contratto ERC-20
    const abi = require('erc-20-abi')
    const web3 = new Web3(window.ethereum);

    //Ottengo i dati degli asset
    this.cryptosList.forEach((crypto) => {
      const name = crypto.name;

      // Trovo l'indirizzo del contratto dell'asset nella rete di destinazione
      const targetCrypto = crypto.addresses.find((obj) => obj.networkName === this.networkSwappable);

      if (targetCrypto!.tokenAddress !== '') {
        const targetAddress = targetCrypto?.tokenAddress;
        tokenArray.push({ address: targetAddress!, name: name });
      }



    })
    // Recupero i saldi degli asset per il portafoglio
    const tokenBalances: any[] = [];
    let counter = 0;
    tokenArray.forEach((tokenObj) => {
      const tokenContract = new web3.eth.Contract(abi, tokenObj.address);
      const balance = tokenContract.methods.balanceOf(this.accountConnected).call().then((data: any) => {
        if (
          tokenObj.address === '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599' ||
          tokenObj.address === '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6' ||
          tokenObj.address === '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c' ||
          tokenObj.address === '0x68f180fcce6836688e9084f035309e29bf0a2095' ||
          tokenObj.address === '0x321162Cd933E2Be498Cd2267a90534A804051b11' ||
          tokenObj.address === '0x408d4cd0adb7cebd1f1a1c33a0ba2098e1295bab' ||
          tokenObj.address === '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f'
        ) {
          let formatBalance = Number(data / (10 ** 8))
          tokenBalances.push({ tokenObj, formatBalance })
          counter++;
        } else {
          let formatBalance = Number(web3.utils.fromWei(data))
          tokenBalances.push({ tokenObj, formatBalance })
          counter++;
        }
      });
    });
    // Ottiene il saldo del portafoglio connesso
    const balance = await web3.eth.getBalance(this.accountConnected).then((b) => {
      const newB: any = web3.utils.toNumber(b);
      const balanceFormatted = newB / (10 ** 18);
      const ethBalance = { tokenObj: { name: 'ETH' }, formatBalance: balanceFormatted };
      tokenBalances.push(ethBalance)
      this.tokenInfoArray = tokenBalances;
    })
  }

  // Metodo per ottenere i dati relativi agli asset
  getAssetData() {
    this.mktSvc.getAllAssetAndNetworks().subscribe(data => {
      this.cryptosList = data;
    })
  }

}
