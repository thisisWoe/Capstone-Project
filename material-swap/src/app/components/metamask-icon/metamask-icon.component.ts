import { Component, OnInit } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Web3Service } from 'src/app/web3-serv/web3.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-metamask-icon',
  templateUrl: './metamask-icon.component.html',
  styleUrls: ['./metamask-icon.component.scss']
})
export class MetamaskIconComponent implements OnInit {
  walletLogged: boolean = false;
  wallet$!: Observable<any>;

  Network_ID: number;

  network = {
    Ethereum:
      {
        id: 1,
        ZERO_x_URL: environment.ZERO_x_URL_ETHEREUM
      },
    Polygon:
      {
        id: 137,
        ZERO_x_URL: environment.ZERO_x_URL_POLYGON
      },
    Binance:
      {
        id: 56,
        ZERO_x_URL: environment.ZERO_x_URL_BSC
      },
    Optimism:
      {
        id: 10,
        ZERO_x_URL: environment.ZERO_x_URL_OPTIMISM
      },
    Fantom:
      {
        id: 250,
        ZERO_x_URL: environment.ZERO_x_URL_FANTOM
      },
    Avalance:
      {
        id: 43114,
        ZERO_x_URL: environment.ZERO_x_URL_AVALANCHE
      },
    Arbitrum:
      {
        id: 42161,
        ZERO_x_URL: environment.ZERO_x_URL_ARBITRUM
      },

  }

  constructor(private web3Svc: Web3Service) {
    this.wallet$ = this.web3Svc.metamask$;
    this.Network_ID = this.network.Arbitrum.id;
  }
  ngOnInit(): void {
    this.wallet$.subscribe((wallet) => {
      this.walletLogged = wallet;
      console.log("🚀 ~ file: swap.component.ts:29 ~ SwapComponent ~ this.wallet$.subscribe ~ wallet:", wallet)
    });

    this.switchMetamaskNetwork(this.network.Arbitrum.id);
  }

  connectMetamask() {
    this.web3Svc.connect();
  }

  switchMetamaskNetwork(id:number) {
    try {
      const stringId = id.toString();
      console.log("🚀 ~ file: metamask-icon.component.ts:75 ~ MetamaskIconComponent ~ switchMetamaskNetwork ~ stringId:", stringId)
      this.web3Svc.switchNetwork(stringId)
        .then(res => {
          console.log('Network Switched: ', res);
        })
    } catch (error) {
      console.error(error);
      this.Network_ID = this.network.Arbitrum.id;
    }
  }

  onSelectNetworkChange(newValue:number){
    console.log("New Network ID: ", newValue)
    this.switchMetamaskNetwork(newValue);
  }

}
