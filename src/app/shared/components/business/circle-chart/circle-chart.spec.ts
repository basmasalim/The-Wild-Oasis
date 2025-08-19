import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleChart } from './circle-chart';

describe('CircleChart', () => {
  let component: CircleChart;
  let fixture: ComponentFixture<CircleChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircleChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircleChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
