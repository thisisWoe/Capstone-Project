import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { Web3Service } from 'src/app/web3-serv/web3.service';

@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss']
})
export class CreationComponent implements OnInit, AfterViewInit {
  @ViewChild('pageContainer', { static: true }) pageContainer!: ElementRef;

  formNFT!: FormGroup;
  walletAddress$: Observable<any>;
  targetWalletAddress: string | null = null;

  networkString$: Observable<string | null>;
  targetNetwork: string | null = null;

  dataToCreate = {
    name: '',
    description: '',
    imgURI: '',
    contractAddress: ''
  }

  nftName:string = '';
  nftDescription:string = '';
  nftImg:string = '';
  nftValid:boolean = false;

  confirmation:boolean = false;


  constructor(private fb: FormBuilder, private authSvc: AuthService, private web3Svc: Web3Service, private http: HttpClient, private modalService: NgbModal) {
    this.walletAddress$ = this.web3Svc.metamask$;
    this.networkString$ = this.web3Svc.network$
  }

  ngOnInit(): void {
    this.formNFT = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      imgURI: ['', Validators.required],
      contractAddress: ['', Validators.required]
    });
    this.walletAddress$.subscribe(wallet => {
      if (wallet) {
        // Imposto l'indirizzo del portafoglio attivo
        this.targetWalletAddress = wallet.selectedAddress;
        this.networkString$.subscribe(network => {
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

          this.formNFT = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            imgURI: ['', Validators.required],
            contractAddress: [targetNetwork!.deployedContract, Validators.required]
          });
        })
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

  // Metodo per mintare un nuovo NFT
  createNFT() {
    // Ottiene i dati per creare il nuovo NFT dal form
    this.dataToCreate = this.formNFT.value;
    if (this.dataToCreate.contractAddress === '' || this.dataToCreate.contractAddress === undefined || this.dataToCreate.contractAddress === null) {
      if(this.targetNetwork){
        this.dataToCreate.contractAddress = this.targetNetwork;
      }
    }

    if (this.targetWalletAddress) {
      this.web3Svc.createNFT(this.dataToCreate.name, this.dataToCreate.description, this.dataToCreate.imgURI, this.dataToCreate.contractAddress, this.targetWalletAddress)
        .then(response => {
          this.confirmation = true;
          this.formNFT.reset();

        })
    }
  }

  connectMetamask() {
    this.web3Svc.connect();
  }

  //Inserimento dinamico del nome
  onInputNameChange(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.nftName = inputValue;
  }

  //Inserimento dinamico della descrizione
  onInputDescriptionChange(event: Event) {
  const inputValue = (event.target as HTMLInputElement).value;
  this.nftDescription = inputValue;

  }

  //inserimento dinamico dell'URL
  onInputImgChange(event: Event) {
    //this.nftValid = false;
    const inputValue = (event.target as HTMLInputElement).value;
    if (inputValue === '') {
      this.nftValid = false;
    }
    this.isImageUrlValid(inputValue).subscribe((isValid) => {
      if (isValid) {
        if (inputValue === '') {
          this.nftValid = false;
        } else {
          this.nftImg = inputValue;
          this.nftValid = true;
        }
      } else {
        this.nftValid = false;
      }
    });

  }

  // Metodo per verificare se l'URL dell'immagine è valido
  isImageUrlValid(imageUrl: string): Observable<boolean> {
    // Fai una richiesta HTTP HEAD all'URL dell'immagine
    return this.http.head(imageUrl).pipe(
      map(() => true), // Se la richiesta ha successo, restituisci true
      catchError(() => of(false)) // Se la richiesta fallisce, restituisci false
    );
  }
}
