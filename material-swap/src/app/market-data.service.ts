import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment.development';
import { tap } from 'rxjs';
import { MarketResponse } from './interfaces/market-response';

@Injectable({
  providedIn: 'root'
})
export class MarketDataService {
  jwtHelper:JwtHelperService = new JwtHelperService();
  merketDataApi:string = environment.coinApi_url;
  slash:string = '/';

  constructor(private http: HttpClient, private router: Router) {}

  getDataBTC(coin1:string, coin2:string){
    return this.http.get<MarketResponse>(this.merketDataApi+coin1+this.slash+coin2)
    .pipe(tap(data => {

      console.log("🚀 ~ file: market-data.service.ts:21 ~ MarketDataService ~ getDataBTC ~ data:", data)
    }))
  }









}
