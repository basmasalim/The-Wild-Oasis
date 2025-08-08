import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinsFilters } from './cabins-filters';

describe('CabinsFilters', () => {
  let component: CabinsFilters;
  let fixture: ComponentFixture<CabinsFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabinsFilters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinsFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
