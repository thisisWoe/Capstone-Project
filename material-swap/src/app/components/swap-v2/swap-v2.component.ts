import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { IAssetDto } from 'src/app/interfaces/iasset-dto';
import { IObjInEntrance } from 'src/app/interfaces/iobj-in-entrance';
import { MarketDataService } from 'src/app/market-data.service';
import { Web3Service } from 'src/app/web3-serv/web3.service';

@Component({
  selector: 'app-swap-v2',
  templateUrl: './swap-v2.component.html',
  styleUrls: ['./swap-v2.component.scss']
})
export class SwapV2Component implements AfterViewInit, OnInit{
  @ViewChild('swap') private swapRef!: ElementRef;
  swapElement!: HTMLDivElement;
  @ViewChild('btnConnectSwap') private swapBtnRef!: ElementRef;
  swapBtnElement!: HTMLButtonElement;

  walletLogged: boolean = false;
  wallet$: Observable<any>;

  currentCryptoFrom!: IObjInEntrance;
  currentCryptoTo!: IObjInEntrance;

  networkString$: Observable<string | null>;
  networkSwappable: string | null = null;
  valueToFetch: boolean = false;
  amount!: number;

  inputValue: string = '';

  cryptosList: IAssetDto[] = [];
  selectedItemFrom: any | null;
  selectedItemTo: any;

  catchUrlToFetch$: Observable<string>;
  targetUrlToFetch$: string = '';


  constructor(private web3Svc: Web3Service, private mktSvc: MarketDataService, private modalService: NgbModal) {
    this.wallet$ = this.web3Svc.metamask$;
    this.catchUrlToFetch$ = this.web3Svc.ZeroXtarget$;
    this.networkString$ = this.web3Svc.network$
  }

  ngOnInit(): void {
    // Ottengo i dati relativi agli asset
    this.getAssetData();

    // Sottoscrizioni agli observable
    this.wallet$.subscribe((wallet) => {
      this.walletLogged = wallet;
    });

    this.catchUrlToFetch$.subscribe((url) => {
      this.targetUrlToFetch$ = url;
    });

    this.networkString$.subscribe((network) => {
      this.networkSwappable = network;
    });
  }

  ngAfterViewInit(): void {
    this.setDimension();
  }

  //modale
  openLg(content: any) {
    this.modalService.open(content, { size: 'lg' });
    const modalContent = <HTMLDivElement>document.querySelector('.modal-content');
    modalContent.style.backgroundImage = 'url(./../../../assets/imgs/chart-back-pie.png)';
    modalContent.style.borderRadius = '2rem';
    const modalHeader = <HTMLDivElement>modalContent.querySelector('.modal-header');
    modalHeader.style.border = 'none';
    const button = <HTMLButtonElement>modalContent.querySelector('.btn');
    button.style.color = 'white';
    button.style.backgroundColor = '#1f1739';
    button.style.border = '#1px solid #be6dab';
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

      this.swapElement.style.width = (window.innerWidth / 100) * 90 + 'px';
      this.swapElement.style.height = (window.innerWidth / 100) * 90 + 'px';
    } else {
      console.log('nothing changed');
    }
  }

  //connessione a metamask
  connectMetamask() {
    this.web3Svc.connect();
  }

  // Metodo chiamato quando il valore di input cambia
  onInputChange(newValue: string) {
    // Verifico se il valore è valido per effettuare una richiesta
    if (newValue !== '' && newValue !== '0' && newValue !== '0.') {
      this.valueToFetch = true;
    } else {
      this.valueToFetch = false;
    }
    if (newValue === '0' || newValue === '0.') {
    } else if (
      newValue === '' ||
      newValue === '0' ||
      newValue === '0.' ||
      !this.currentCryptoFrom === null ||
      !this.currentCryptoFrom === undefined ||
      !this.currentCryptoTo === null ||
      !this.currentCryptoTo === undefined
    ) {
      const amountTokenTo = document.querySelector('.outputTo');
      amountTokenTo!.textContent = '0';
    } else {
      let amount = parseFloat(newValue);
      this.amount = amount;
      this.getQuote(this.amount, this.currentCryptoFrom.tokenAddress, this.currentCryptoTo.tokenAddress, this.targetUrlToFetch$);
    }
  }

  // Metodo chiamato quando viene selezionato un asset di partenza
  onSelectFromChange(newValue: string) {
    // Abilito le opzioni di destinazione
    let selectTo = document.querySelector('.select-to');
    if (selectTo && selectTo.hasAttribute('disabled')) {
      selectTo.removeAttribute('disabled');
    }

    // Abilito le opzioni disabilitate
    let allOptionsSelectTo = document.querySelectorAll('.options-to')
    const allOptSelToArray = Array.from(allOptionsSelectTo);
    allOptSelToArray.forEach(opt => {
      if (opt.hasAttribute('disabled')) {
        opt.removeAttribute('disabled');
      }
    })
    // Disabilito l'opzione selezionata come asset di destinazione
    const newValueObj: IAssetDto = JSON.parse(newValue);
    const targetOption = allOptSelToArray.find(opt => opt.textContent === newValueObj.name);
    if (targetOption) {
      targetOption.setAttribute('disabled', 'true');
    }
    // Trovo l'indirizzo del token di partenza
    const addressArray: IObjInEntrance[] = newValueObj.addresses;
    const targetAddress: IObjInEntrance = <IObjInEntrance>addressArray.find(address => address.networkName === this.networkSwappable!.toLowerCase())
    if (targetAddress) {
      this.currentCryptoFrom = targetAddress;
    }
    // Calcolo e mostra il prezzo del token da ricevere
    if (this.currentCryptoFrom && this.currentCryptoTo && this.valueToFetch) {
      this.getQuote(this.amount, this.currentCryptoFrom.tokenAddress, this.currentCryptoTo.tokenAddress, this.targetUrlToFetch$);
    }
  }

  // Metodo chiamato quando viene selezionato un asset di destinazione
  onSelectToChange(newValue: string) {
    // Trovo l'indirizzo del token di destinazione
    const newValueObj: IAssetDto = JSON.parse(newValue);
    const addressArray: IObjInEntrance[] = newValueObj.addresses;
    const targetAddress: IObjInEntrance = <IObjInEntrance>addressArray.find(address => address.networkName === this.networkSwappable!.toLowerCase())
    if (targetAddress) {
      this.currentCryptoTo = targetAddress;
    }
  }

  // Metodo per ottenere un preventivo per lo scambio
  getQuote(amountToSwap: number, tokenAddressFrom: string, tokenAddressTo: string, networkZeroX: string) {
    // Richiesta per ottenere il prezzo dello scambio
    this.web3Svc.getPrice_V2(amountToSwap, tokenAddressFrom, tokenAddressTo, networkZeroX).subscribe(quote => {
      // Calcolo il prezzo totale e mostra il risultato
      const amountTokenTo = document.querySelector('.outputTo');
      const grossPrice = quote.grossPrice;
      const totalPrice = grossPrice * amountToSwap;
      const totalString = totalPrice.toString();
      amountTokenTo!.textContent = totalString.slice(0, 12);
    });
  }

  // Metodo per verificare se un asset ha una rete con un indirizzo del token specificato
  hasNetworkWithTokenAddress(item: IAssetDto, targetNetwork: string): boolean {
    if (item && item.addresses && targetNetwork !== null) {
      let found = false;
      item.addresses.forEach((address) => {
        if (address.networkName === targetNetwork.toLowerCase() && address.tokenAddress !== '') {
          found = true;
        }
      });
      return found;
    } else {
      return false;
    }
  }

  // Metodo per effettuare lo scambio
  trySwap(amountToSwap: number, tokenAddressFrom: string, tokenAddressTo: string, networkZeroX: string) {
    this.web3Svc.trySwap_V2(amountToSwap, tokenAddressFrom, tokenAddressTo, networkZeroX)
  }

  // Metodo per ottenere i dati relativi agli asset
  getAssetData() {

    this.mktSvc.getAllAssetAndNetworks().subscribe(data => {
      this.cryptosList = data;

    })
  }
}
