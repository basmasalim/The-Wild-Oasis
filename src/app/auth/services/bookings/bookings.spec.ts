import { TestBed } from '@angular/core/testing';

import { Bookings } from './bookings';

describe('Bookings', () => {
  let service: Bookings;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bookings);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
