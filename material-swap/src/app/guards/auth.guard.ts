
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private AuthService: AuthService, private router: Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Verifico lo stato di autenticazione dell'utente attraverso l'observable isLoggedIn$ del servizio di autenticazione
    return this.AuthService.isLoggedIn$.pipe(map(isLoggedIn => {
      if (!isLoggedIn) {
        // Se l'utente non è autenticato, lo reindirizzo alla pagina di autenticazione
        this.router.navigate(['home/auth'])
      }
      return isLoggedIn
    }))
  }
  // Metodo per verificare se l'utente può attivare una rotta figlia della rotta principale
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }
}
