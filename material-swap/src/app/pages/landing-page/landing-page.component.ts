import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent /* implements OnInit, AfterViewInit */ {
  scrollHeight: number = 0;

  constructor() {

  }

  /* ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  } */

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    this.scrollHeight = window.scrollY;
    console.log('Altezza dello scrolling dalla parte superiore della pagina:', this.scrollHeight);
    const hero = <HTMLDivElement>document.querySelector('.hero');
    const heroH = hero.offsetHeight;
    const nav = document.querySelector('nav');
    // Puoi eseguire azioni basate sulla posizione dello scrolling qui
    if (this.scrollHeight >= heroH) {
      nav!.style.backgroundColor = '#38359bcb';
      // Esempio: Esegui qualcosa quando lo scrolling raggiunge i 200 pixel dall'alto
    } else {
      nav!.style.backgroundColor = 'transparent';

    }
  }






}
