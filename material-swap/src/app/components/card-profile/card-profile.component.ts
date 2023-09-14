import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import anime from 'animejs/lib/anime.es.js';
import { Observable } from 'rxjs';
import { Web3Service } from 'src/app/web3-serv/web3.service';
import Web3 from 'web3';
import { Contract, ethers } from 'ethers';



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

  tokenInfoArray:any[] = [];

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

  constructor(private web3Svc: Web3Service) {
    this.wallet$ = this.web3Svc.metamask$;
    this.networkString$ = this.web3Svc.network$
  }

  ngOnInit(): void {

    this.wallet$.subscribe((wallet) => {
      if (wallet) {
        this.walletInfo = wallet;
        console.log("this.walletInfo:", this.walletInfo)
        this.accountConnected = this.walletInfo.selectedAddress;
        /* for(let key in wallet){
          console.log(key);
        } */
        this.networkString$.subscribe((network) => {
          if (network) {
            this.networkSwappable = network!.toLowerCase();
            console.log("🚀 ~ file: card-profile.component.ts:323 ~ CardProfileComponent ~ this.networkString$.subscribe ~ this.networkSwappable:", this.networkSwappable)
            this.retrieveWalletData();
          }

        });
      }
    })


  }

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

    if(this.walletInfo){
      const info = document.querySelector('.infoContainer');
      const infoWrapper:NodeListOf<HTMLDivElement> = document.querySelectorAll('.infoWrapper');
      infoWrapper.forEach((i: HTMLDivElement) => {
        if(i.offsetWidth === 0){
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
    if(this.walletInfo){
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

  async retrieveWalletData() {
    const tokenArray: any[] = [];
    const tokenArrayName: string[] = [];
    const abi = require('erc-20-abi')
    const web3 = new Web3(window.ethereum);


    this.cryptosList.forEach((crypto) => {
      const name = crypto.name;

      const targetCrypto = crypto.address.find((obj) => obj.network_name === this.networkSwappable);

      if (targetCrypto!.tokenAddress !== '') {
        const targetAddress = targetCrypto?.tokenAddress;
        tokenArray.push({address:targetAddress!, name:name});
      }



    })
    console.log(tokenArray);

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
            let formatBalance = Number(data / (10**8))
            tokenBalances.push({tokenObj, formatBalance})
            counter++;
          } else {
            let formatBalance = Number(web3.utils.fromWei(data))
            tokenBalances.push({tokenObj, formatBalance})
            counter++;
          }
        });
      });
      const balance = await web3.eth.getBalance(this.accountConnected).then((b) => {
        const newB:any = web3.utils.toNumber(b);
        const balanceFormatted = newB / (10**18);
        const ethBalance = {tokenObj:{name: 'ETH'}, formatBalance:balanceFormatted};
        tokenBalances.push(ethBalance)
        console.log("🚀 ~ file: card-profile.component.ts:439 ~ CardProfileComponent ~ balance ~ tokenBalances:", tokenBalances)
        this.tokenInfoArray = tokenBalances;
        console.log("🚀 ~ file: card-profile.component.ts:452 ~ CardProfileComponent ~ balance ~ this.tokenInfoArray:", this.tokenInfoArray)
      })
  }

}
