import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('slider', { static: true }) slider!: ElementRef;
  isDragging = false;
  startX = 0;
  slideX = 0;

  constructor(private authSvc: AuthService, private web3Svc: Web3Service) {
    this.walletAddress$ = this.web3Svc.metamask$;
    this.networkString$ = this.web3Svc.network$
  }

  ngOnInit(): void {
    this.walletAddress$.subscribe(wallet => {
      if (wallet) {
        this.targetWalletAddress = wallet.selectedAddress;
        this.networkString$.subscribe((network) => {
          if (network) {
            this.targetNetwork = network!.toLowerCase();

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

            const targetNetwork = nftNetworkStruct.find(network => network.network === this.targetNetwork);
            console.log("targetNetwork:", targetNetwork)
            this.targetNftAddress = targetNetwork!.deployedContract;
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

  getSingleNftUser(idNFT: number, contractAddress: string) {
    this.web3Svc.getNFTDetails(idNFT, contractAddress)
      .then((data) => {
        this.gallery.push(data);
        console.log('nft', data)
      })
  }

  getAllNft(takerAddress: string, deployedContractAddress: string) {
    return this.web3Svc.getAllNFT(takerAddress, deployedContractAddress);
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (this.isDragging) {
      this.isDragging = false;
      event.preventDefault();
      event.stopPropagation();
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const deltaX = event.clientX - this.startX;
      this.slideX += deltaX;
      this.startX = event.clientX;
      this.slider.nativeElement.style.transition = 'transform 0.2s';
    }
  }

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.clientX;
    this.slider.nativeElement.style.transition = 'transform 0.2s';
    event.preventDefault();
    event.stopPropagation();
  }


}
