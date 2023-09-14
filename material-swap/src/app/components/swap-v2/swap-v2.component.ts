import { MetamaskIconComponent } from './../metamask-icon/metamask-icon.component';
import { AfterViewInit, Component, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { INetwork } from 'src/app/interfaces/Inetwork';
import { ICryptoData } from 'src/app/interfaces/icrypto-data';
import { ITokenAddressData } from 'src/app/interfaces/itoken-address-data';
import { Web3Service } from 'src/app/web3-serv/web3.service';
import Web3 from 'web3';

@Component({
  selector: 'app-swap-v2',
  templateUrl: './swap-v2.component.html',
  styleUrls: ['./swap-v2.component.scss']
})
export class SwapV2Component {
  @ViewChild('swap') private swapRef!: ElementRef;
  swapElement!: HTMLDivElement;
  @ViewChild('btnConnectSwap') private swapBtnRef!: ElementRef;
  swapBtnElement!: HTMLButtonElement;

  walletLogged: boolean = false;
  wallet$: Observable<any>;

  currentCryptoFrom!:ITokenAddressData;
  currentCryptoTo!:ITokenAddressData;

  networkString$: Observable<string | null>;
  networkSwappable: string | null = null;
  valueToFetch:boolean = false;
  amount!:number;

  inputValue: string = '';
  //ZERO_x_TARGET$: Observable<string>;

  cryptosList = [
    {//WBTC
      name: 'WBTC',
      img: '',
      address: [
        {
          network_name: 'ethereum',
          tokenAddress: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        },
        {
          network_name: 'polygon',
          tokenAddress: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
        },
        {
          network_name: 'bsc',
          tokenAddress: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
        },
        {
          network_name: 'optimism',
          tokenAddress: '0x68f180fcce6836688e9084f035309e29bf0a2095',
        },
        {
          network_name: 'fantom',
          tokenAddress: '0x321162Cd933E2Be498Cd2267a90534A804051b11',
        },
        {
          network_name: 'avalance',
          tokenAddress: '0x408d4cd0adb7cebd1f1a1c33a0ba2098e1295bab',
        },
        {
          network_name: 'arbitrum',
          tokenAddress: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
        },
      ]
    },
    {//WETH
      name: 'WETH',
      img: '',
      address: [
        {
          network_name: 'ethereum',
          tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        },
        {
          network_name: 'polygon',
          tokenAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
        },
        {
          network_name: 'bsc',
          tokenAddress: '0x4DB5a66E937A9F4473fA95b1cAF1d1E1D62E29EA',
        },
        {
          network_name: 'optimism',
          tokenAddress: '0x4200000000000000000000000000000000000006',
        },
        {
          network_name: 'fantom',
          tokenAddress: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
        },
        {
          network_name: 'avalance',
          tokenAddress: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
        },
        {
          network_name: 'arbitrum',
          tokenAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
        },
      ]
    },
    {//UNI
      name: 'UNI',
      img: '',
      address: [
        {
          network_name: 'ethereum',
          tokenAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
        },
        {
          network_name: 'polygon',
          tokenAddress: '0xb33eaad8d922b1083446dc23f610c2567fb5180f',
        },
        {
          network_name: 'bsc',
          tokenAddress: '0xbf5140a22578168fd562dccf235e5d43a02ce9b1',
        },
        {
          network_name: 'optimism',
          tokenAddress: '0x6fd9d7AD17242c41f7131d257212c54A0e816691',
        },
        {
          network_name: 'fantom',
          tokenAddress: '',
        },
        {
          network_name: 'avalance',
          tokenAddress: '',
        },
        {
          network_name: 'arbitrum',
          tokenAddress: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
        },
      ]
    },
    {//LINK
      name: 'LINK',
      img: '',
      address: [
        {
          network_name: 'ethereum',
          tokenAddress: '0x514910771af9ca656af840dff83e8264ecf986ca',
        },
        {
          network_name: 'polygon',
          tokenAddress: '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39',
        },
        {
          network_name: 'bsc',
          tokenAddress: '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd',
        },
        {
          network_name: 'optimism',
          tokenAddress: '0x350a791bfc2c21f9ed5d10980dad2e2638ffa7f6',
        },
        {
          network_name: 'fantom',
          tokenAddress: '0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8',
        },
        {
          network_name: 'avalance',
          tokenAddress: '0x5947bb275c521040051d82396192181b413227a3',
        },
        {
          network_name: 'arbitrum',
          tokenAddress: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
        },
      ]
    },
    {//BAL
      name: 'BAL',
      img: '',
      address: [
        {
          network_name: 'ethereum',
          tokenAddress: '0xba100000625a3754423978a60c9317c58a424e3D',
        },
        {
          network_name: 'polygon',
          tokenAddress: '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3',
        },
        {
          network_name: 'bsc',
          tokenAddress: '',
        },
        {
          network_name: 'optimism',
          tokenAddress: '0xFE8B128bA8C78aabC59d4c64cEE7fF28e9379921',
        },
        {
          network_name: 'fantom',
          tokenAddress: '',
        },
        {
          network_name: 'avalance',
          tokenAddress: '',
        },
        {
          network_name: 'arbitrum',
          tokenAddress: '0x040d1edc9569d4bab2d15287dc5a4f10f56a56b8',
        },
      ]
    },
    {//SUSHI
      name: 'SUSHI',
      img: '',
      address: [
        {
          network_name: 'ethereum',
          tokenAddress: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
        },
        {
          network_name: 'polygon',
          tokenAddress: '0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a',
        },
        {
          network_name: 'bsc',
          tokenAddress: '0x947950BcC74888a40Ffa2593C5798F11Fc9124C4',
        },
        {
          network_name: 'optimism',
          tokenAddress: '',
        },
        {
          network_name: 'fantom',
          tokenAddress: '0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC',
        },
        {
          network_name: 'avalance',
          tokenAddress: '0x39cf1bd5f15fb22ec3d9ff86b0727afc203427cc',
        },
        {
          network_name: 'arbitrum',
          tokenAddress: '0xd4d42f0b6def4ce0383636770ef773390d85c61a',
        },
      ]
    },
    {//DAI
      name: 'DAI',
      img: '',
      address: [
        {
          network_name: 'ethereum',
          tokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
        },
        {
          network_name: 'polygon',
          tokenAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        },
        {
          network_name: 'bsc',
          tokenAddress: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
        },
        {
          network_name: 'optimism',
          tokenAddress: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
        },
        {
          network_name: 'fantom',
          tokenAddress: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
        },
        {
          network_name: 'avalance',
          tokenAddress: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
        },
        {
          network_name: 'arbitrum',
          tokenAddress: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
        },
      ]
    },
    {//SYN
      name: 'SYN',//SYNAPSE
      img: '',
      address: [
        {
          network_name: 'ethereum',
          tokenAddress: '0x0f2D719407FdBeFF09D87557AbB7232601FD9F29',
        },
        {
          network_name: 'polygon',
          tokenAddress: '0xf8f9efc0db77d8881500bb06ff5d6abc3070e695',
        },
        {
          network_name: 'bsc',
          tokenAddress: '0xa4080f1778e69467e905b8d6f72f6e441f9e9484',
        },
        {
          network_name: 'optimism',
          tokenAddress: '0x5A5fFf6F753d7C11A56A52FE47a177a87e431655',
        },
        {
          network_name: 'fantom',
          tokenAddress: '0xe55e19fb4f2d85af758950957714292dac1e25b2',
        },
        {
          network_name: 'avalance',
          tokenAddress: '0x1f1e7c893855525b303f99bdf5c3c05be09ca251',
        },
        {
          network_name: 'arbitrum',
          tokenAddress: '0x080f6aed32fc474dd5717105dba5ea57268f46eb',
        },
      ]
    },
  ];

  selectedItemFrom:any|null;
  selectedItemTo:any;

  catchUrlToFetch$: Observable<string>;
  targetUrlToFetch$: string = '';


  constructor(private web3Svc: Web3Service) {
    this.wallet$ = this.web3Svc.metamask$;
    this.catchUrlToFetch$ = this.web3Svc.ZeroXtarget$;
    this.networkString$ = this.web3Svc.network$
    //this.ZERO_x_TARGET$ = this.metamaskData.ZeroXtarget$;
  }

  ngOnInit(): void {

    //this.getQuote(10, '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', 'https://arbitrum.api.0x.org/swap/v1/');
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

  onInputChange(newValue: string) {
    // Esegui azioni con il nuovo valore dell'input
    console.log('Nuovo valore dell\'input:', newValue);
    if (newValue !== '' && newValue !== '0' && newValue !== '0.') {
      this.valueToFetch = true;
    } else {
      this.valueToFetch = false;
    }
    if (newValue === '0' || newValue === '0.') {
      console.log('waiting for valid input.');
    } else if(
        newValue === '' ||
        newValue === '0' ||
        newValue === '0.' ||
        !this.currentCryptoFrom === null ||
        !this.currentCryptoFrom === undefined ||
        !this.currentCryptoTo === null ||
        !this.currentCryptoTo === undefined
    ){
      const amountTokenTo = document.querySelector('.outputTo');
      amountTokenTo!.textContent = '0';
    } else {
      let amount = parseFloat(newValue);
      this.amount = amount;
      this.getQuote(this.amount, this.currentCryptoFrom.tokenAddress, this.currentCryptoTo.tokenAddress, this.targetUrlToFetch$);
    }
  }

  onSelectFromChange(newValue: string){
    console.log('Nuovo valore del select:', newValue);

    let selectTo = document.querySelector('.select-to');
    if (selectTo && selectTo.hasAttribute('disabled')) {
      selectTo.removeAttribute('disabled');
    }

    let allOptionsSelectTo = document.querySelectorAll('.options-to')
    const allOptSelToArray = Array.from(allOptionsSelectTo);
    allOptSelToArray.forEach(opt => {
      if (opt.hasAttribute('disabled')) {
        opt.removeAttribute('disabled');
      }
    })
    const newValueObj : ICryptoData= JSON.parse(newValue);
    console.log("🚀 ~ file: swap.component.ts:385 ~ SwapComponent ~ onSelectFromChange ~ newValueObj:", newValueObj)
    const targetOption = allOptSelToArray.find(opt => opt.textContent === newValueObj.name);
    if (targetOption) {
      targetOption.setAttribute('disabled', 'true');
    }

    const addressArray:ITokenAddressData[] = newValueObj.address;
    console.log(this.networkSwappable);
    const targetAddress:ITokenAddressData = <ITokenAddressData>addressArray.find(address => address.network_name === this.networkSwappable!.toLowerCase())
    if (targetAddress) {
      this.currentCryptoFrom = targetAddress;
      console.log("🚀 ~ file: swap.component.ts:418 ~ SwapComponent ~ onSelectFromChange ~ this.currentCryptoFrom:", this.currentCryptoFrom)
    }
    if(this.currentCryptoFrom && this.currentCryptoTo && this.valueToFetch){
      this.getQuote(this.amount, this.currentCryptoFrom.tokenAddress, this.currentCryptoTo.tokenAddress, this.targetUrlToFetch$);
    }
  }

  onSelectToChange(newValue: string){
    console.log('Nuovo valore del select:', newValue);
    const newValueObj : ICryptoData= JSON.parse(newValue);
    const addressArray:ITokenAddressData[] = newValueObj.address;
    console.log(this.networkSwappable);
    const targetAddress:ITokenAddressData = <ITokenAddressData>addressArray.find(address => address.network_name === this.networkSwappable!.toLowerCase())
    console.log("🚀 ~ file: swap.component.ts:427 ~ SwapComponent ~ onSelectToChange ~ targetAddress:", targetAddress)
    if (targetAddress) {
      this.currentCryptoTo = targetAddress;
    }
  }

  getQuote(amountToSwap:number, tokenAddressFrom:string, tokenAddressTo:string, networkZeroX:string){
    this.web3Svc.getPrice_V2(amountToSwap, tokenAddressFrom, tokenAddressTo, networkZeroX).subscribe(quote => {
      console.log(quote);
      const amountTokenTo = document.querySelector('.outputTo');
      const grossPrice = quote.grossPrice;
      const totalPrice = grossPrice*amountToSwap;
      const totalString = totalPrice.toString();
      amountTokenTo!.textContent = totalString.slice(0, 12);
    });
  }

  hasNetworkWithTokenAddress(item: ICryptoData, targetNetwork: string): boolean {
    if (targetNetwork !== null) {
      let found = false;
      item.address.forEach((address) => {
        if(address.network_name === targetNetwork.toLowerCase() && address.tokenAddress !== ''){
          found = true;
        }
      });
      return found;
    } else {
      return false;
    }
  }

  trySwap(amountToSwap:number, tokenAddressFrom:string, tokenAddressTo:string, networkZeroX:string){
    this.web3Svc.trySwap_V2(amountToSwap, tokenAddressFrom, tokenAddressTo, networkZeroX)
  }
}
