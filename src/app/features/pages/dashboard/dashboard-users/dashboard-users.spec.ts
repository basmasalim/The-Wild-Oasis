import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUsers } from './dashboard-users';

describe('DashboardUsers', () => {
  let component: DashboardUsers;
  let fixture: ComponentFixture<DashboardUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
