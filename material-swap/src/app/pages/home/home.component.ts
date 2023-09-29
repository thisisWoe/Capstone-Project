import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { IAuthData } from 'src/app/interfaces/iauth-data';
import { MarketDataService } from 'src/app/market-data.service';
import { Web3Service } from 'src/app/web3-serv/web3.service';
import jwt_decode from "jsonwebtoken";
import anime from 'animejs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userCheck$: Observable<IAuthData | null>;
  isAdmin: boolean = false;
  isLogged: boolean = false;
  menuHide: boolean = true;
  activeLink = 'swap-v2';


  constructor(private marketSvc: MarketDataService, private web3Svc: Web3Service, private authSvc: AuthService) {
    this.userCheck$ = this.authSvc.user$;
  }


  ngOnInit(): void {
    // Sottoscrizione all'observable dell'utente per gestire lo stato di login/logout
    this.authSvc.user$.subscribe((user) => {

      if (user) {
        this.isLogged = true;
        if (user.username === '0xcb98a882261e900f68e3d4f514372a25ab6aa847') {
          this.isAdmin = true;
        }
      } else {
        this.isLogged = false;
      }
    });

    const header = <HTMLDivElement>document.querySelector('div.header');
    const routerWrapper = <HTMLDivElement>document.querySelector('.main-wrapper');
    routerWrapper.style.height = this.authSvc.sizingRouterApp();
    routerWrapper.style.maxHeight = this.authSvc.sizingRouterApp();
  }

  toggleRouterMenu() {
    this.menuHide = !this.menuHide;
  }

  animationRouterMenu() {
    const swapA = <HTMLAnchorElement>document.querySelector('.route-swap');
    const dashboardA = <HTMLAnchorElement>document.querySelector('.route-dashboard');
    const strategyA = <HTMLAnchorElement>document.querySelector('.route-strategy');
    const loginA = <HTMLAnchorElement>document.querySelector('.route-admin');
    const logoutA = <HTMLAnchorElement>document.querySelector('.route-logout');
    const creationA = <HTMLAnchorElement>document.querySelector('.route-creation');
    const galleryA = <HTMLAnchorElement>document.querySelector('.route-gallery');

    if (this.menuHide) {
      swapA.style.display = 'block';
      dashboardA.style.display = 'block';
      strategyA.style.display = 'block';
      loginA.style.display = 'block';
      logoutA.style.display = 'block';
      creationA.style.display = 'block';
      galleryA.style.display = 'block';

      anime({
        targets: [swapA, dashboardA, strategyA, loginA, logoutA, creationA, galleryA],
        delay: 0,
        keyframes: [
          { translateX: -150 },
          { translateX: -200, opacity: 1 },
        ],
        duration: 500,
        easing: 'linear',
        loop: false,
        complete: () => {
          anime({
            targets: [dashboardA, strategyA, loginA, logoutA, creationA, galleryA],
            delay: 0,
            keyframes: [{ translateY: -50 }],
            duration: 125,
            easing: 'linear',
            loop: false,
            complete: () => {
              anime({
                targets: [strategyA, loginA, logoutA, creationA, galleryA],
                delay: 0,
                keyframes: [{ translateY: -100 }],
                duration: 125,
                easing: 'linear',
                loop: false,
                complete: () => {
                  anime({
                    targets: [loginA, logoutA, creationA, galleryA],
                    delay: 0,
                    keyframes: [{ translateY: -150 }],
                    duration: 125,
                    easing: 'linear',
                    loop: false,
                    complete: () => {
                      anime({
                        targets: [logoutA, creationA, galleryA],
                        delay: 0,
                        keyframes: [{ translateY: -200 }],
                        duration: 125,
                        easing: 'linear',
                        loop: false,
                        complete: () => {
                          anime({
                            targets: [logoutA, galleryA],
                            delay: 0,
                            keyframes: [{ translateY: -250 }],
                            duration: 125,
                            easing: 'linear',
                            loop: false,
                            complete: () => {
                              anime({
                                targets: [logoutA],
                                delay: 0,
                                keyframes: [{ translateY: -300 }],
                                duration: 125,
                                easing: 'linear',
                                loop: false,
                              })
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          });
        },
      });
      this.toggleRouterMenu();
    } else {
      anime({
        targets: [logoutA],
        delay: 0,
        keyframes: [{ translateY: -300 }],
        duration: 125,
        easing: 'linear',
        loop: false,
        complete: () => {
          anime({
            targets: [galleryA, logoutA],
            delay: 0,
            keyframes: [{ translateY: -250 }],
            duration: 125,
            easing: 'linear',
            loop: false,
            complete: () => {
              anime({
                targets: [logoutA, galleryA, creationA],
                delay: 0,
                keyframes: [{ translateY: -200 }],
                duration: 125,
                easing: 'linear',
                loop: false,
                complete: () => {
                  anime({
                    targets: [logoutA, galleryA, creationA, loginA],
                    delay: 0,
                    keyframes: [{ translateY: -150 }],
                    duration: 125,
                    easing: 'linear',
                    loop: false,
                    complete: () => {
                      anime({
                        targets: [logoutA, galleryA, creationA, loginA, strategyA],
                        delay: 0,
                        keyframes: [{ translateY: -100 }],
                        duration: 125,
                        easing: 'linear',
                        loop: false,
                        complete: () => {
                          anime({
                            targets: [logoutA, galleryA, creationA, loginA, dashboardA, strategyA],
                            delay: 0,
                            keyframes: [{ translateY: -50 }],
                            duration: 125,
                            easing: 'linear',
                            loop: false,
                            complete: () => {
                              anime({
                                targets: [logoutA, galleryA, creationA, loginA, logoutA, strategyA, dashboardA],
                                delay: 0,
                                keyframes: [{ translateY: -0 }],
                                duration: 125,
                                easing: 'linear',
                                loop: false,
                                complete: () => {
                                  anime({
                                    targets: [logoutA, galleryA, creationA, loginA, logoutA, strategyA, dashboardA, swapA],
                                    delay: 0,
                                    keyframes: [
                                      { translateX: -250 },
                                      { translateX: -125, opacity: 0 },
                                    ],
                                    duration: 250,
                                    easing: 'linear',
                                    loop: false,
                                    complete: () => {
                                      swapA.style.display = 'none';
                                      dashboardA.style.display = 'none';
                                      strategyA.style.display = 'none';
                                      loginA.style.display = 'none';
                                      logoutA.style.display = 'none';
                                    }
                                  })
                                }
                              })
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
      this.toggleRouterMenu();
    }


  }

  logout() {
    this.authSvc.logout();
    location.reload();
  }


  prova() {
    const swapA = <HTMLAnchorElement>document.querySelector('.route-swap');
    const dashboardA = <HTMLAnchorElement>document.querySelector('.route-dashboard');
    const strategyA = <HTMLAnchorElement>document.querySelector('.route-strategy');
    const loginA = <HTMLAnchorElement>document.querySelector('.route-admin');
    const logoutA = <HTMLAnchorElement>document.querySelector('.route-logout');
    const creationA = <HTMLAnchorElement>document.querySelector('.route-creation');
    const galleryA = <HTMLAnchorElement>document.querySelector('.route-gallery');

    anime({
      targets: [logoutA],
      delay: 0,
      keyframes: [{ translateY: -3000 }],
      duration: 125,
      easing: 'linear',
      loop: false,
      complete: () => {
        anime({
          targets: [galleryA, logoutA],
          delay: 0,
          keyframes: [{ translateY: -250 }],
          duration: 125,
          easing: 'linear',
          loop: false,
          complete: () => {
            anime({
              targets: [logoutA, galleryA, creationA],
              delay: 0,
              keyframes: [{ translateY: -200 }],
              duration: 125,
              easing: 'linear',
              loop: false,
              complete: () => {
                anime({
                  targets: [logoutA, dashboardA, strategyA, loginA],
                  delay: 0,
                  keyframes: [{ translateY: -150 }],
                  duration: 125,
                  easing: 'linear',
                  loop: false,
                  complete: () => {
                    anime({
                      targets: [logoutA, galleryA, creationA, loginA, logoutA],
                      delay: 0,
                      keyframes: [{ translateY: -100 }],
                      duration: 250,
                      easing: 'linear',
                      loop: false,
                      complete: () => {
                        anime({
                          targets: [logoutA, galleryA, creationA, loginA, logoutA, strategyA],
                          delay: 0,
                          keyframes: [{ translateY: -50 }],
                          duration: 250,
                          easing: 'linear',
                          loop: false,
                          complete: () => {
                            anime({
                              targets: [logoutA, galleryA, creationA, loginA, logoutA, strategyA, dashboardA],
                              delay: 0,
                              keyframes: [{ translateY: -0 }],
                              duration: 250,
                              easing: 'linear',
                              loop: false,
                              complete: () => {
                                anime({
                                  targets: [logoutA, galleryA, creationA, loginA, logoutA, strategyA, dashboardA, swapA],
                                  delay: 0,
                                  keyframes: [
                                    { translateX: -250 },
                                    { translateX: -125, opacity: 0 },
                                  ],
                                  duration: 250,
                                  easing: 'linear',
                                  loop: false,
                                  complete: () => {
                                    swapA.style.display = 'none';
                                    dashboardA.style.display = 'none';
                                    strategyA.style.display = 'none';
                                    loginA.style.display = 'none';
                                    logoutA.style.display = 'none';
                                  }
                                })
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  }
}

