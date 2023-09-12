import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetamaskIconComponent } from './metamask-icon.component';

describe('MetamaskIconComponent', () => {
  let component: MetamaskIconComponent;
  let fixture: ComponentFixture<MetamaskIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MetamaskIconComponent]
    });
    fixture = TestBed.createComponent(MetamaskIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
