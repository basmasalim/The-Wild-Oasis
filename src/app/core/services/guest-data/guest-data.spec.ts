import { TestBed } from '@angular/core/testing';

import { UserData } from './guest-data';

describe('UserData', () => {
  let service: UserData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
