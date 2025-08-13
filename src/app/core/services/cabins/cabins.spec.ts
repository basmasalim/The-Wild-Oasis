import { TestBed } from '@angular/core/testing';

import { Cabins } from './cabins';

describe('Cabins', () => {
  let service: Cabins;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cabins);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
