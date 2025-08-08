import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSettings } from './dashboard-settings';

describe('DashboardSettings', () => {
  let component: DashboardSettings;
  let fixture: ComponentFixture<DashboardSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
