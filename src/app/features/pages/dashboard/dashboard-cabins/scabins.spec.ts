import { TestBed } from '@angular/core/testing';

import { Scabins } from './scabins';

describe('Scabins', () => {
  let service: Scabins;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Scabins);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
