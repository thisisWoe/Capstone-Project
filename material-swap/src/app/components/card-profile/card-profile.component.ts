import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import anime from 'animejs/lib/anime.es.js';



@Component({
  selector: 'app-card-profile',
  templateUrl: './card-profile.component.html',
  styleUrls: ['./card-profile.component.scss']
})
export class CardProfileComponent implements OnInit {
  @ViewChild('animatedImg', { static: true }) animatedElement!: ElementRef;




  ngOnInit(): void {
    this.zoomAndMove();
  }

  zoomAndMove(){
    const element = this.animatedElement.nativeElement;
    anime({
        targets: element,
        delay: 0,
        keyframes: [
          {
            opacity: 0.05,
            translateY: 190,
            translateX: 150,
            scale: 2,
          },
          {
            opacity: 1,
            translateY: 0,
            translateX: 0,
            scale: 1,
          }
        ],
        duration: 1000,
        easing: 'linear',
        loop: false
    });
  }

  zoomAndMoveBack(){
    const element = this.animatedElement.nativeElement;
    anime({
        targets: element,
        delay: 0,
        keyframes: [
          {
            opacity: 1,
            translateY: -190,
            translateX: -150,
            scale: -2,
          }
        ],
        duration: 500,
        easing: 'linear',
        loop: false
    });
  }

}
