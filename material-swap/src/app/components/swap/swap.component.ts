import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss']
})
export class SwapComponent implements AfterViewInit {
  @ViewChild('swap') private swapRef!: ElementRef;
  swapElement!:HTMLDivElement;



  ngAfterViewInit(): void {
    this.setDimension();
  }

  getSwapRef(): HTMLDivElement {
    return this.swapRef.nativeElement;
  }

  setDimension(){
    if(window.innerWidth < 961){
      this.swapElement = this.getSwapRef();
      console.log(window.innerWidth);

      this.swapElement.style.width = (window.innerWidth /100)*90 + 'px';
      this.swapElement.style.height = (window.innerWidth /100)*90 + 'px';
      console.log(this.swapElement.style.width);
      console.log(this.swapElement.style.height);

    } else {
      console.log('nothing changed');

    }
  }

}
