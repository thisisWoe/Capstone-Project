import { Component, OnInit } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from 'rxjs';
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
  ZERO_x_TARGET: string;



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
    BSC:
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
    this.ZERO_x_TARGET = this.network.Arbitrum.ZERO_x_URL;
  }
  ngOnInit(): void {
    this.wallet$.subscribe((wallet) => {
      this.walletLogged = wallet;
    });

    this.switchMetamaskNetwork(this.network.Arbitrum.id);

  }

  connectMetamask() {
    this.web3Svc.connect();
  }

  switchMetamaskNetwork(id: number) {
    try {
      const stringId = id.toString();
      console.log("🚀 ~ file: metamask-icon.component.ts:75 ~ MetamaskIconComponent ~ switchMetamaskNetwork ~ stringId:", stringId)
      this.web3Svc.switchNetwork(stringId)
        .then(res => {
          console.log('Network Switched: ', res);
          if (res) {
            this.updateNetworkSubject(Number(id));
          }

          if (!res) {
            this.Network_ID = this.network.Arbitrum.id;
          }
        })
    } catch (error) {
      console.error(error);
    }
  }

  updateNetworkSubject(id: number) {
    type Network = {
      id: number;
      ZERO_x_URL: string;
    };

    type Networks = {
      [key: string]: Network;
    };

    const X: Networks = this.network;
    /* const X: Networks = {
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
      BSC:
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
    }; */

    for (const key in X) {
      if (X.hasOwnProperty(key)) {

        let currentObj = X[key];
        if (currentObj.id === id) {
          console.log(`Network with id ${id} found in ${key}.`);
          this.web3Svc.ZERO_x_TARGET_subject.next(currentObj.ZERO_x_URL);
          /* console.log(this.web3Svc.ZeroXtarget$);
          console.log(this.web3Svc.ZERO_x_TARGET_subject); */

          break;
        }

      } else {
        console.log('Nessun Oggetto Trovato.');

      }
    }
  }

  onSelectNetworkChange(newValue: number) {
    console.log("New Network ID: ", newValue)
    this.switchMetamaskNetwork(newValue);
  }

}
