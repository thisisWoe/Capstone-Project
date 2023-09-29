import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { INetworks } from 'src/app/interfaces/inetworks';
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
      // Invio una richiesta a Metamask per cambiare la rete
      this.web3Svc.switchNetwork(stringId)
        .then(res => {
          console.log('Network Switched: ', res);
          // Se il cambio di rete è riuscito, aggiorno l'interfaccia utente con la nuova rete selezionata
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

  // Metodo per aggiornare l'observable della rete selezionata nel servizio Web3Service
  updateNetworkSubject(id: number) {
    const X: INetworks = this.network;
    // Itero attraverso gli oggetti di rete per trovare la rete corrispondente all'ID fornito
    for (const key in X) {
      if (X.hasOwnProperty(key)) {

        let currentObj = X[key];
        if (currentObj.id === id) {
          console.log(`Network with id ${id} found in ${key}.`);
          this.web3Svc.ZERO_x_TARGET_subject.next(currentObj.ZERO_x_URL);
          this.web3Svc.targetNetworkSubject.next(key);
          break;
        }

      } else {
        console.log('Network not found.');
      }
    }
  }

  // Metodo chiamato quando l'utente seleziona una nuova rete
  onSelectNetworkChange(newValue: number) {
    console.log("New Network ID: ", newValue)
    this.switchMetamaskNetwork(newValue);
  }

}
