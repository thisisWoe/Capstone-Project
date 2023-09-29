import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { INft } from 'src/app/interfaces/inft';
import { Web3Service } from 'src/app/web3-serv/web3.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, AfterViewInit {
  @ViewChild('pageContainer', { static: true }) pageContainer!: ElementRef;

  walletAddress$: Observable<any>;
  targetWalletAddress: string | null = null;

  networkString$: Observable<string | null>;
  targetNetwork: string | null = null;

  targetNftAddress: string | null = null;

  gallery: INft[] = [];

  constructor(private authSvc: AuthService, private web3Svc: Web3Service) {
    this.walletAddress$ = this.web3Svc.metamask$;
    this.networkString$ = this.web3Svc.network$
  }

  ngOnInit(): void {
    this.walletAddress$.subscribe(wallet => {
      if (wallet) {
        // Imposto l'indirizzo del portafoglio selezionato
        this.targetWalletAddress = wallet.selectedAddress;
        // Ottengo la rete selezionata
        this.networkString$.subscribe((network) => {
          if (network) {
            this.targetNetwork = network!.toLowerCase();
            // Definisco lo Smart Contract per gli NFT
            const nftNetworkStruct = [
              {
                network: 'arbitrum',
                deployedContract: '0xaFE0Ff7ac928F234C0339B56E3F10ECe5F55871d'
              },
              {
                network: 'polygon',
                deployedContract: '0x0de370569D4aa7BdA716E8dE2511aEfBBA7A137C'
              },
            ]
            // Trovo il contratto NFT corrispondente alla rete selezionata
            const targetNetwork = nftNetworkStruct.find(network => network.network === this.targetNetwork);
            console.log("targetNetwork:", targetNetwork)
            this.targetNftAddress = targetNetwork!.deployedContract;
            // Ottengo tutti gli NFT per l'utente sulla rete selezionata
            this.getAllNft(this.targetWalletAddress!, this.targetNftAddress)
              .then((res) => {
                console.log("res:", res)
                for (let index = 0; index < res; index++) {
                  this.getSingleNftUser(index, this.targetNftAddress!)
                }
              });
          }
        });
      }
    })
  }

  ngAfterViewInit(): void {
    this.resizePage();
  }

  resizePage() {
    const pageContainer = this.pageContainer.nativeElement;
    pageContainer.style.height = this.authSvc.sizingRouterApp();
  }

  // Metodo per ottenere i dettagli di un singolo NFT
  getSingleNftUser(idNFT: number, contractAddress: string) {
    // Ottengo i dettagli dell'NFT con l'ID specificato e l'indirizzo del contratto
    this.web3Svc.getNFTDetails(idNFT, contractAddress)
      .then((data) => {
        this.gallery.push(data);
        console.log('nft', data)
      })
  }

  getAllNft(takerAddress: string, deployedContractAddress: string) {
    return this.web3Svc.getAllNFT(takerAddress, deployedContractAddress);
  }

}
