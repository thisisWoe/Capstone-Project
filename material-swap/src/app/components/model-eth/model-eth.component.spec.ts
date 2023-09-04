import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelEthComponent } from './model-eth.component';

describe('ModelEthComponent', () => {
  let component: ModelEthComponent;
  let fixture: ComponentFixture<ModelEthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModelEthComponent]
    });
    fixture = TestBed.createComponent(ModelEthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
