import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { IAssetDto } from 'src/app/interfaces/iasset-dto';
import { IObjNetworkDto } from 'src/app/interfaces/iobj-network-dto';
import { FormControl } from '@angular/forms';
import { MarketDataService } from 'src/app/market-data.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements AfterViewInit, OnInit {
  @ViewChild('adminPageContainer', { static: true }) adminContainer!: ElementRef;
  @ViewChild('networkCreation', { static: true }) networkCreation!: ElementRef;
  @ViewChild('selectNetwork', { static: true }) selectNetwork!: ElementRef;
  formAssetAndNetwork!: FormGroup;
  networkToAdd: number[] = [1];
  startValue: number = 1;

  newAsset: IAssetDto = {
    name: '',
    imgUrl: '',
    addresses: []
  };

  newObjNetwork: IObjNetworkDto = {
    asset: null,
    networkName: 'ethereum',
    tokenAddress: ''
  };

  networks: IObjNetworkDto[] = [];

  networkAvailable: string[] = [
    'ethereum',
    'polygon',
    'bsc',
    'optimism',
    'fantom',
    'avalance',
    'arbitrum'
  ];

  constructor(private authSvc: AuthService, private fb: FormBuilder, private mktSvc: MarketDataService) {

  }
  ngOnInit(): void {
    this.formAssetAndNetwork = this.fb.group({
      name: ['', Validators.required],
      imgUrl: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.resizePage();
  }

  resizePage() {
    const adminPageContainer = this.adminContainer.nativeElement;
    adminPageContainer.style.height = this.authSvc.sizingRouterApp();
  }

  onChangeNetworkToAdd(event: Event) {
    console.log("event:", event)
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log("selectedValue:", selectedValue)
    this.newObjNetwork.asset = null;
    this.newObjNetwork.networkName = selectedValue;
    console.log("this.newObjNetwork:", this.newObjNetwork)
    console.log("selectedValue:", selectedValue)


  }

  onChangeTokenAddress(event: Event) {
    const selectedValue = (event.target as HTMLInputElement).value;
    this.newObjNetwork.asset = null;
    this.newObjNetwork.tokenAddress = selectedValue;
    console.log("this.newObjNetwork:", this.newObjNetwork)
    console.log("selectedValue:", selectedValue)
  }

  createButtonNetwork() {
    let newObj: IObjNetworkDto = {
      asset: null,
      networkName: '',
      tokenAddress: ''
    };

    newObj = this.newObjNetwork;
    this.newObjNetwork = {
      asset: null,
      networkName: 'ethereum',
      tokenAddress: ''
    };

    const newArray = this.networkAvailable.filter(string => string !== newObj.networkName);
    this.networkAvailable = newArray;

    this.networks.push(newObj);
    console.log("this.networks:", this.networks)

    const target = <HTMLDivElement>this.networkCreation.nativeElement;
    const toast = this.createToasts(newObj);

    target.appendChild(toast);
    console.log("target:", target)
    const maxWidthText = toast.offsetWidth;
    console.log("maxWidthText:", maxWidthText)
    const allDiv = document.querySelectorAll('.toast-body') as NodeListOf<HTMLElement>;
    allDiv.forEach(strong => {
      strong.style.whiteSpace = 'nowrap';
      strong.style.overflow = 'hidden';
      strong.style.textOverflow = 'ellipsis';
      strong.style.maxWidth = maxWidthText + 'px';
    })
  }

  createToasts(newObj: IObjNetworkDto): HTMLDivElement {
    const toastDiv = document.createElement('div');
    toastDiv.classList.add('toast');
    toastDiv.setAttribute('role', 'alert');
    toastDiv.setAttribute('aria-live', 'assertive');
    toastDiv.setAttribute('aria-atomic', 'true');
    toastDiv.style.display = 'inline-block';
    toastDiv.style.width = '33%';

    // Creazione dell'elemento per l'intestazione del toast
    const toastHeader = document.createElement('div');
    toastHeader.classList.add('toast-header');

    // Creazione dell'elemento per il nome della rete
    const strong = document.createElement('strong');
    strong.classList.add('me-auto');
    strong.textContent = newObj.networkName;

    // Creazione dell'elemento per il pulsante di chiusura
    const closeButton = document.createElement('button');
    closeButton.setAttribute('type', 'button');
    closeButton.classList.add('btn-close');
    closeButton.setAttribute('data-bs-dismiss', 'toast');
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.addEventListener('click', () =>{
      const parentElement = closeButton.parentElement;


      const strong = parentElement?.querySelector('strong');


      const networkName = strong?.textContent;
      this.networkAvailable.push(networkName!);
      const par = parentElement?.parentElement;
      par?.remove();
      const newNetwork = this.networks.filter(obj => obj.networkName !== networkName);
      this.networks = newNetwork;
      console.log("this.networks:", this.networks)
    })

    // Aggiunta di tutti gli elementi all'intestazione del toast
    toastHeader.appendChild(strong);
    toastHeader.appendChild(closeButton);

    // Creazione dell'elemento per il corpo del toast
    const toastBody = document.createElement('div');
    toastBody.classList.add('toast-body');
    toastBody.textContent = newObj.tokenAddress;

    // Aggiunta degli elementi all'elemento principale del toast
    toastDiv.appendChild(toastHeader);
    toastDiv.appendChild(toastBody);

    const inputAddress = <HTMLInputElement>document.querySelector('.input-token-address');
    console.log("inputAddress:", inputAddress)
    inputAddress!.value = '';
    return toastDiv;
  }

  listAsset(){
    console.log(this.formAssetAndNetwork.value);
    this.newAsset = this.formAssetAndNetwork.value;

    this.mktSvc.addAsset(this.newAsset).subscribe(data => {
      console.log("data:", data)
    });
  }



}
