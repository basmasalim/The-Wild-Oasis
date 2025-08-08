import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinsTable } from './cabins-table';

describe('CabinsTable', () => {
  let component: CabinsTable;
  let fixture: ComponentFixture<CabinsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabinsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
