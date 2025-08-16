import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDetails } from './booking-details';

describe('BookingDetails', () => {
  let component: BookingDetails;
  let fixture: ComponentFixture<BookingDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
