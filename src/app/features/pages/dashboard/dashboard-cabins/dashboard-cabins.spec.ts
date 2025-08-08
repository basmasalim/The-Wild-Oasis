import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCabins } from './dashboard-cabins';

describe('DashboardCabins', () => {
  let component: DashboardCabins;
  let fixture: ComponentFixture<DashboardCabins>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCabins]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCabins);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
