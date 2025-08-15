import { TestBed } from '@angular/core/testing';

import { Sproduct } from './sproduct';

describe('Sproduct', () => {
  let service: Sproduct;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sproduct);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
