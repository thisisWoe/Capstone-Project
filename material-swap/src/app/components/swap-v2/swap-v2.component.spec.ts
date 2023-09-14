import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapV2Component } from './swap-v2.component';

describe('SwapV2Component', () => {
  let component: SwapV2Component;
  let fixture: ComponentFixture<SwapV2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SwapV2Component]
    });
    fixture = TestBed.createComponent(SwapV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
