import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IAuthData } from './interfaces/iauth-data';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Web3Service } from './web3-serv/web3.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  jwtHelper:JwtHelperService = new JwtHelperService();
  registerUrl:string = environment.API_BACKEND + 'auth/signup';
  loginUrl:string = environment.API_BACKEND + 'auth/login';

  private authSubject = new BehaviorSubject<null | IAuthData>(null)
  user$ = this.authSubject.asObservable();
  isLoggedIn$ = this.user$.pipe(map(user => Boolean(user)));

  autoLogTimer: any;



  constructor(private http: HttpClient, private router: Router, private web3Svc: Web3Service) {


    //this.restoreUser();
  }















}
