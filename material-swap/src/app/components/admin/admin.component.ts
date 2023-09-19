import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { IAssetDto } from 'src/app/interfaces/iasset-dto';
import { IObjNetworkDto } from 'src/app/interfaces/iobj-network-dto';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements AfterViewInit, OnInit {
  @ViewChild('adminPageContainer', { static: true }) adminContainer!: ElementRef;
  formAssetAndNetwork!: FormGroup;
  networkToAdd: number[] = [1];
  startValue: number = 1;

  newAsset: IAssetDto = {
    name: '',
    imgUrl: '',
    addresses: []
  };

  newObjNetwork: IObjNetworkDto = {
    asset: this.newAsset,
    networkName: '',
    tokenAddress: ''
  };

  networkAvailable: string[] = [
    'ethereum',
    'polygon',
    'bsc',
    'optimism',
    'fantom',
    'avalance',
    'arbitrum'
  ];

  constructor(private authSvc: AuthService, private fb: FormBuilder) {

  }
  ngOnInit(): void {
    this.formAssetAndNetwork = this.fb.group({
      name: ['', Validators.required],
      imgUrl: ['', Validators.required],
      networkAndAddresses: this.fb.array([]),
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
    this.networkToAdd = [];

    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log("selectedValue:", selectedValue)
    for (let index = 0; index < Number(selectedValue); index++) {
      this.networkToAdd.push(index);
    }
    const selectNetNumberContainer = <HTMLDivElement>document.querySelector('.network-data-select');
    this.networkToAdd.forEach(() => {
      selectNetNumberContainer.innerHTML +=
        `

        `;
    })

  }

}
