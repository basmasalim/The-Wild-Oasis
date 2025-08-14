import { TestBed } from '@angular/core/testing';

import { Authintication } from './authintication';

describe('Authintication', () => {
  let service: Authintication;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Authintication);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
