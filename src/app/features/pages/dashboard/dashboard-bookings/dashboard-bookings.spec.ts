import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBookings } from './dashboard-bookings';

describe('DashboardBookings', () => {
  let component: DashboardBookings;
  let fixture: ComponentFixture<DashboardBookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardBookings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardBookings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
