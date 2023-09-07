import { TestBed } from '@angular/core/testing';

import { MarketInterceptorInterceptor } from './market-interceptor.interceptor';

describe('MarketInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      MarketInterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: MarketInterceptorInterceptor = TestBed.inject(MarketInterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
