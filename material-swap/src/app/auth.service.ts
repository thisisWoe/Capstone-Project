import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IAuthData } from './interfaces/iauth-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Web3Service } from './web3-serv/web3.service';
import { RegisterDto } from './interfaces/register-dto';
import { LoginDto } from './interfaces/login-dto';

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
    this.restoreUser();
  }


  signUp(data: RegisterDto) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(environment.API_BACKEND + 'auth/signup', data, {
      headers,
      responseType: 'text' // Imposto responseType su 'text' per ottenere una risposta come stringa
    })
  }

  signIn(data: LoginDto){
    return this.http.post<IAuthData>(environment.API_BACKEND + 'auth/signin', data)
    .pipe(tap(data => {
      this.authSubject.next(data);
      localStorage.setItem('user', JSON.stringify(data));

      const expDate = this.jwtHelper.getTokenExpirationDate(data.accessToken) as Date;
      this.autoLogout(expDate)
    }))
  }

  logout(){
    this.authSubject.next(null);
    localStorage.removeItem('user');
  }

  autoLogout(expDate:Date){
    const expMs = expDate.getTime() - new Date().getTime()
    this.autoLogTimer = setTimeout(() => {
      this.logout();
    }, expMs)
  }

  restoreUser(){
    const userJson = localStorage.getItem('user');
    if(!userJson){
      return
    }

    const user: IAuthData = JSON.parse(userJson);
    if(this.jwtHelper.isTokenExpired(user.accessToken)){
      return;
    }

    this.authSubject.next(user);
    console.log('You are logged.');
  }













}
