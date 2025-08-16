import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Cabins } from '../../../../core/services/cabins/cabins';
import { Icabins } from '../../../../core/interfaces/icabins';
import { MenuItem } from 'primeng/api';
import { SORTING_OPTIONS } from '../../../../core/constants/sorting.constants';
import { DISCOUNT_CONSTANTS } from '../../../../core/constants/discount.constants';
import { Discount } from '../../../../core/enum/discount.emum';
import { FilterDiscountPipe } from '../../../../core/pipe/filter-discount/filter-discount-pipe';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-dashboard-cabins',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    RatingModule,
    CommonModule,
    ButtonModule,
    FilterDiscountPipe,
    Menu,
  ],
  templateUrl: './dashboard-cabins.html',
  styleUrl: './dashboard-cabins.scss',
})
export class DashboardCabins implements OnInit {
  cabins!: Icabins[];
  first = 0;
  rows = 5;
  totalRecords = 0;
  filteredStatus: Discount | 'all' = 'all';

  discountOptions = DISCOUNT_CONSTANTS;
  sortOptions = SORTING_OPTIONS;

  private readonly cabians = inject(Cabins);

  ngOnInit(): void {
    this.loadCabinsData();
  }

  private loadCabinsData(): void {
    this.cabians.getCabinsData().subscribe({
      next: (res: Icabins[]) => {
        this.cabins = res;
        this.totalRecords = res.length;
      },
    });
  }

  applyFilter(status: Discount | 'all'): void {
    this.filteredStatus = status;
    this.first = 0;
  }

  getMenuItems(cabin: Icabins): MenuItem[] {
    return [
      {
        label: 'See details',
        icon: 'pi pi-eye m-3 text-xl',
      },
      {
        label: 'Edit cabin',
        icon: 'pi pi-pencil m-3 text-xl',
      },
      {
        label: 'Delete booking',
        icon: 'pi pi-trash m-3 text-xl',
      },
    ];
  }

  // Pagination methods
  onClick(event: any) {
    this.first = event.first;
  }

  goToNext() {
    if (!this.isLastPage()) {
      this.first += this.rows;
    }
  }

  goToPrev() {
    if (!this.isFirstPage()) {
      this.first -= this.rows;
    }
  }

  isFirstPage(): boolean {
    return this.first === 0;
  }

  isLastPage(): boolean {
    return this.first + this.rows >= this.totalRecords;
  }
}
