import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayTable } from './today-table';

describe('TodayTable', () => {
  let component: TodayTable;
  let fixture: ComponentFixture<TodayTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
