import { TestBed } from '@angular/core/testing';

import { Authintcation } from './authintcation';

describe('Authintcation', () => {
  let service: Authintcation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Authintcation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
