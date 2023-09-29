import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { IAssetDto } from 'src/app/interfaces/iasset-dto';
import { IObjNetworkDto } from 'src/app/interfaces/iobj-network-dto';
import { FormControl } from '@angular/forms';
import { MarketDataService } from 'src/app/market-data.service';
import anime from 'animejs';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements AfterViewInit, OnInit {
  @ViewChild('adminPageContainer', { static: true }) adminContainer!: ElementRef;
  @ViewChild('networkCreation', { static: true }) networkCreation!: ElementRef;
  @ViewChild('selectNetwork', { static: true }) selectNetwork!: ElementRef;
  @ViewChild('assetTargetReceiver', { static: true }) assetTargetReceiver!: ElementRef;
  formAssetAndNetwork!: FormGroup;
  formEditAsset!: FormGroup;
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
    'avalanche',
    'arbitrum'
  ];

  allStoredAssets: IAssetDto[] = [];

  targetEdit: IAssetDto | null = null;

  stringHTML = ``;

  //datepicker
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  tokenToFetch: string | null = null;
  tokenToFetchId: number | null = null;

  constructor(private authSvc: AuthService, private fb: FormBuilder, private mktSvc: MarketDataService, calendar: NgbCalendar) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }
  ngOnInit(): void {
    this.formAssetAndNetwork = this.fb.group({
      name: ['', Validators.required],
      imgUrl: ['', Validators.required],
    });
    this.formEditAsset = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      imgUrl: ['', Validators.required],
      addresses: this.fb.array([])
    })

    this.getAssets();

  }

  ngAfterViewInit(): void {
    this.resizePage();
  }

  resizePage() {
    const adminPageContainer = this.adminContainer.nativeElement;
    adminPageContainer.style.height = this.authSvc.sizingRouterApp();
  }

  onChangeNetworkToAdd(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.newObjNetwork.asset = null;
    this.newObjNetwork.networkName = selectedValue;
  }

  onChangeTokenAddress(event: Event) {
    const selectedValue = (event.target as HTMLInputElement).value;
    this.newObjNetwork.asset = null;
    this.newObjNetwork.tokenAddress = selectedValue;
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

    const target = <HTMLDivElement>this.networkCreation.nativeElement;
    const toast = this.createToasts(newObj);

    target.appendChild(toast);
    const maxWidthText = toast.offsetWidth;
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
    toastDiv.style.width = '32%';
    toastDiv.style.border = '1px solid #be6dab';
    toastDiv.style.marginRight = '3px';

    // Creazione dell'elemento per l'intestazione del toast
    const toastHeader = document.createElement('div');
    toastHeader.classList.add('toast-header');
    toastHeader.style.backgroundColor = '#be6dab5a';

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
    closeButton.addEventListener('click', () => {
      const parentElement = closeButton.parentElement;


      const strong = parentElement?.querySelector('strong');


      const networkName = strong?.textContent;
      this.networkAvailable.push(networkName!);
      const par = parentElement?.parentElement;
      par?.remove();
      const newNetwork = this.networks.filter(obj => obj.networkName !== networkName);
      this.networks = newNetwork;
    })

    // Aggiunta di tutti gli elementi all'intestazione del toast
    toastHeader.appendChild(strong);
    toastHeader.appendChild(closeButton);

    // Creazione dell'elemento per il corpo del toast
    const toastBody = document.createElement('div');
    toastBody.classList.add('toast-body');
    toastBody.textContent = newObj.tokenAddress;
    toastBody.style.backgroundColor = '#1f1739';
    toastBody.style.color = 'white';

    // Aggiunta degli elementi all'elemento principale del toast
    toastDiv.appendChild(toastHeader);
    toastDiv.appendChild(toastBody);

    const inputAddress = <HTMLInputElement>document.querySelector('.input-token-address');
    inputAddress!.value = '';
    this.getAssets();
    return toastDiv;
  }

  listAsset() {
    this.newAsset = this.formAssetAndNetwork.value;

    this.mktSvc.addAsset(this.newAsset).subscribe(data => {
      this.addNetwork(data);
    });
    this.formAssetAndNetwork.reset();
    this.getAssets();
  }

  addNetwork(asset: IAssetDto,) {
    this.networks.forEach(network => {
      network.asset = asset;
      this.mktSvc.addObjNetwork(network).subscribe(res => {
        this.networks = [];
        this.networkAvailable = [
          'ethereum',
          'polygon',
          'bsc',
          'optimism',
          'fantom',
          'avalanche',
          'arbitrum'
        ];
        const allToasts = document.querySelectorAll('.toast');
        allToasts.forEach(el => {
          el.remove();
        })
      })
    })


  }

  clear() {
    this.formAssetAndNetwork.reset();

    const allToasts = document.querySelectorAll('.toast');
    allToasts.forEach(el => {
      el.remove();
    });

    this.networks = [];

    this.networkAvailable = [
      'ethereum',
      'polygon',
      'bsc',
      'optimism',
      'fantom',
      'avalanche',
      'arbitrum'
    ];

    const inputAddress = <HTMLInputElement>document.querySelector('.input-token-address');
    inputAddress!.value = '';

  }

  getAssets() {
    this.mktSvc.getAllAssetAndNetworks()
      .subscribe(assets => {
        this.allStoredAssets = assets;

        const assetTargetReceiver: HTMLDivElement = this.assetTargetReceiver.nativeElement;
        assetTargetReceiver.innerHTML = '';
        let targetAssetId: number | null | undefined = null;
        this.allStoredAssets.forEach(asset => {
          const assetWrapper = document.createElement('div');
          assetWrapper.classList.add('asset-wrapper');
          assetWrapper.classList.add('col-4');
          assetWrapper.classList.add('d-flex');
          assetWrapper.classList.add('flex-column');
          assetWrapper.style.cursor = 'pointer';
          assetWrapper.setAttribute('data-asset', asset.id!.toString());

          assetWrapper.innerHTML =
            `
          <div class="asset-img">
            <img src="${asset.imgUrl}" class="img-fluid rounded-circle" />
          </div>
          <div class="asset-name d-flex justify-content-center">
            <p class="text-light mt-2">${asset.name}</p>
          </div>
        `;

          assetWrapper.addEventListener('click', () => {
            const p = assetWrapper.querySelector('p');
            const pText = p?.textContent;
            targetAssetId = Number(assetWrapper.getAttribute('data-asset'));

            const allAssetWrapper = assetTargetReceiver.querySelectorAll('.asset-wrapper');
            const assetWrapperArray = Array.from(allAssetWrapper) as HTMLDivElement[];
            const aAWFiltered = assetWrapperArray.filter(el => {
              const elP = el.querySelector('p');
              return elP?.textContent !== pText;
            });
            anime({
              targets: aAWFiltered,
              delay: 0,
              keyframes: [
                { translateX: 600 }
              ],
              duration: 500,
              easing: 'linear',
              loop: false
            })
            const remainAsset = <HTMLDivElement>assetWrapperArray.find(el => {
              const elP = el.querySelector('p');
              return elP?.textContent === pText;
            });
            anime({
              targets: remainAsset,
              delay: 0,
              keyframes: [
                { translateX: 600 }
              ],
              duration: 1000,
              easing: 'easeInElastic(1, .6)',
              loop: false
            })
            setTimeout(() => {
              assetWrapperArray.forEach(el => {
                el.remove();

              })
              this.createEditForm(targetAssetId!);
            }, 2000);
          })

          const img = assetWrapper.querySelector('img');
          img!.addEventListener('mouseover', () => {
            img!.style.boxShadow = '0px 0px 28px 9px #BE6DAB';
          })
          img!.addEventListener('mouseleave', () => {
            img!.style.boxShadow = 'none';
          })
          assetTargetReceiver.appendChild(assetWrapper);
        });
      })
  }

  createEditForm(id: number) {

    const spanS = 'style="font-size: 1rem; border: 1px solid #be6dab; background-color: #1f1739; background-color: #be6dab5a; color: white;"';
    const inputS = 'style="font-size: 1rem; border: 1px solid #be6dab; background-color: #1f1739; color: white;"';
    const buttonS = 'style="font-weight: bold; border: 1px solid #be6dab; background-color: #1f1739; border-radius: 2rem;"'
    this.mktSvc.getSingleAsset(id).subscribe(data => {
      const formParts =
        `
          <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm" ${spanS}>Token Symbol</span>
            <input id="input-${data.name}" type="text" class="form-control" aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm" formControlName="name" ${inputS} value="${data.name}">
          </div>

          <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm" ${spanS}>Token Image URL</span>
            <input id="input-${data.imgUrl}" type="text" class="form-control" aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm" formControlName="imgUrl" ${inputS} value="${data.imgUrl}">
          </div>

          <div class="row target-input-network">

          </div>

          <button type="button" class="btn btn-primary btn-submit-edit" ${buttonS} >Edit</button>
          <button type="button" class="btn btn-primary btn-back-edit" ${buttonS} >Back</button>
        `;
      const assetTargetReceiver: HTMLDivElement = this.assetTargetReceiver.nativeElement;
      const form =
        `
          <form [formGroup]="formEditAsset" (ngSubmit)="submitEdit()" class="mb-3 edit-form">


          </form>
        `;
      assetTargetReceiver.innerHTML = '';
      assetTargetReceiver.innerHTML += form;
      const formHtml = document.querySelector('.edit-form');
      formHtml!.innerHTML = formParts;
      const button = <HTMLButtonElement>document.querySelector('.btn-submit-edit');
      button.addEventListener('click', () => {
        this.updateAsset();
      })
      const buttonBack = <HTMLButtonElement>document.querySelector('.btn-back-edit');
      buttonBack.addEventListener('click', () => {
        this.back();
      })
      button!.onmouseover = () => {
        button!.style.backgroundColor = '#be6dab5a';
      };
      this.getSingleAsset(id);
    })

  }

  getSingleAsset(id: number) {
    this.stringHTML = ``;
    const spanS = 'style="font-size: 0.7rem; border: 1px solid #be6dab; background-color: #1f1739; background-color: #be6dab5a; color: white;"';
    const inputS = 'style="font-size: 0.7rem; border: 1px solid #be6dab; background-color: #1f1739; color: white;"';
    const targetNetworkReceiver = document.querySelector('.target-input-network');
    targetNetworkReceiver?.classList.add('mt-5')
    this.mktSvc.getSingleAsset(id).subscribe(data => {

      this.compileForm(id, this.formEditAsset, data)

      data.addresses.forEach(address => {
        this.stringHTML =
          `
          <div class="col-6 div-addresses-${data.name}">
            <div class="input-group input-group-sm mb-3 mt-3">
              <span class="input-group-text" id="inputGroup-sizing-sm" ${spanS}>Network</span>
              <input data-id="${address.id}" id="input-${address.networkName}" type="text" class="form-control" aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-sm" formControlName="name" ${inputS} value="${address.networkName}">
            </div>

            <div class="input-group input-group-sm mb-3">
              <span class="input-group-text" id="inputGroup-sizing-sm" ${spanS}>Token Address</span>
              <input id="input-wallet-${address.networkName}" type="text" class="form-control" aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-sm" formControlName="imgUrl" ${inputS} value="${address.tokenAddress}">
            </div>
          </div>

        `;
        targetNetworkReceiver!.innerHTML += this.stringHTML;
      })

    })
  }

  compileForm(id: number, form: FormGroup<any>, data: IAssetDto) {
    const addressesFormArray = form.get('addresses') as FormArray;


    data.addresses.forEach(objNetwork => {
      const addressFormGroup = this.fb.group({
        id: [objNetwork.id, Validators.required],
        networkName: [objNetwork.networkName, Validators.required],
        tokenAddress: [objNetwork.tokenAddress, Validators.required]
      });
      addressesFormArray.push(addressFormGroup);

    });
  }

  submitEdit(): {} {
    const objectToPut: any = {
      id: 0,
      name: '',
      imgUrl: '',
      addresses: [],
    }
    this.allStoredAssets.forEach(asset => {
      const inputElementName = <HTMLInputElement>document.getElementById(`input-${asset.name}`);
      const inputElementImg = <HTMLInputElement>document.getElementById(`input-${asset.imgUrl}`);
      const addresses = document.querySelectorAll(`.div-addresses-${asset.name}`);
      const assetWrapperArray = Array.from(addresses) as HTMLDivElement[];
      const objNetworksArray: any = [];
      if (inputElementName && inputElementImg && addresses) {
        objectToPut.name = inputElementName.value;
        objectToPut.imgUrl = inputElementImg.value;
        assetWrapperArray.forEach(div => {
          this.networkAvailable.forEach(net => {
            const obj = {
              id: 0,
              networkName: '',
              tokenAddress: ''
            };
            const elementNetwork = <HTMLInputElement>div.querySelector(`#input-${net}`);
            const elementAddress = <HTMLInputElement>div.querySelector(`#input-wallet-${net}`);
            if (elementNetwork && elementAddress) {
              const elementId = elementNetwork.getAttribute('data-id');
              obj.id = Number(elementId);
              obj.networkName = elementNetwork!.value;
              obj.tokenAddress = elementAddress!.value;
              objNetworksArray.push(obj);
            }
          })
        })
        objectToPut.addresses = objNetworksArray;
        objectToPut.id = asset.id;
      } else {
      }
    })
    return objectToPut;


  }

  back() {
    const targetNetworkReceiver = document.querySelector('.asset-edit-container');
    targetNetworkReceiver!.innerHTML = '';
    this.getAssets();
  }

  updateAsset() {
    const asset = this.submitEdit();
    this.mktSvc.editAssetAndNetwork(asset)
      .subscribe(assetDto => {
        this.back();
      })
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  confirmselectionDate(): { from: string, to: string } {
    this.toDate!.day = this.toDate!.day;
    const fromDate = new Date(`${this.fromDate.year}-${(this.fromDate.month.toString()).padStart(2, '0')}-${(this.fromDate.day.toString()).padStart(2, '0')}T00:00:00`);
    const toDate = new Date(`${this.toDate!.year}-${(this.toDate!.month.toString()).padStart(2, '0')}-${(this.toDate!.day.toString()).padStart(2, '0')}T00:00:00`);
    toDate.setDate(toDate.getDate() + 1);
    toDate.setMonth(toDate.getMonth() + 1);
    fromDate.setMonth(fromDate.getMonth() + 1);
    const dayTo = (toDate.getDate().toString()).padStart(2, '0');
    const monthTo = (toDate.getMonth().toString()).padStart(2, '0');
    const dayFrom = (fromDate.getDate().toString()).padStart(2, '0');
    const monthFrom = (fromDate.getMonth().toString()).padStart(2, '0');

    let from = `${this.fromDate.year}-${monthFrom}-${dayFrom}`;
    let to = `${this.toDate!.year}-${monthTo}-${dayTo}`;
    return { from: from, to: to };
  }

  sendTokenToFetch(symbol: string, assetId: number) {
    this.tokenToFetch = symbol;
    this.tokenToFetchId = assetId;
  }

  getPricingData() {
    const date = this.confirmselectionDate();
    const from = date.from;
    const to = date.to;

    this.mktSvc.getPeriodData(`${this.tokenToFetch}`, 'USD', from, to)
      .subscribe(data => {
        this.mktSvc.saveDataBackend(data, this.tokenToFetchId!).subscribe(data => {
          console.log("data:", data)
        });
      });
  }

}
