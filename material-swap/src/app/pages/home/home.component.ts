import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { IAuthData } from 'src/app/interfaces/iauth-data';
import { MarketDataService } from 'src/app/market-data.service';
import { Web3Service } from 'src/app/web3-serv/web3.service';
import jwt_decode from "jsonwebtoken";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userCheck$:Observable<IAuthData | null>;
  isAdmin:boolean = false;


  constructor(private marketSvc: MarketDataService, private web3Svc: Web3Service, private authSvc:AuthService) {
    this.userCheck$ = this.authSvc.user$;
  }


  ngOnInit(): void {
    this.authSvc.user$.subscribe((user) => {

      //const decodedToken = jwt_decode(user?.accessToken);
      if (user) {
        console.log('Logged user: ', user);
        if (user.username === '0xcb98a882261e900f68e3d4f514372a25ab6aa847') {
          this.isAdmin = true;
        }
      } else {
        console.log('No logged user.');
      }
    });

    const header = <HTMLDivElement>document.querySelector('div.header');
    const routerWrapper = <HTMLDivElement>document.querySelector('.main-wrapper');

    routerWrapper.style.height = this.authSvc.sizingRouterApp();
    routerWrapper.style.maxHeight = this.authSvc.sizingRouterApp();

    /* this.marketSvc.getDataBTC('UNI', 'USD').subscribe(); */
    //this.web3Svc.connect();
    //this.web3Svc.checkConnection();
  }
}

