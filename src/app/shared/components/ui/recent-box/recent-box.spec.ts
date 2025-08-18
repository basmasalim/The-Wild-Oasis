import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentBox } from './recent-box';

describe('RecentBox', () => {
  let component: RecentBox;
  let fixture: ComponentFixture<RecentBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
