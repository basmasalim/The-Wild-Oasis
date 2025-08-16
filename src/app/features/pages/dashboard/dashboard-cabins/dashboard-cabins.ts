
import { Component, OnInit } from '@angular/core';
=======
import { Component, inject, OnInit } from '@angular/core';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Cabins } from '../../../../core/services/cabins/cabins';
import { Icabins } from '../../../../core/interfaces/icabins';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-cabins',
=======
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

    FormsModule,
=======
    FilterDiscountPipe,
    Menu,

  ],
  templateUrl: './dashboard-cabins.html',
  styleUrl: './dashboard-cabins.scss',
})
export class DashboardCabins implements OnInit {
  cabins!: Icabins[];

  filteredStatus: string = '';
  sortOption: string = 'name-asc'; // إضافة متغير لتتبع خيار الفرز الحالي
  sortedCabins: Icabins[] = [];

  constructor(private cabinServ: Cabins) {}

  // دالة الفرز عند تغيير الاختيار
  onSortChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.sortOption = selectElement.value;
    this.sortData(); // استدعاء دالة الفرز
  }

  // دالة تنفيذ الفرز
  private sortData() {
    if (!this.cabins) return;

    this.sortedCabins = [...this.cabins].sort((a, b) => {
      switch (this.sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'regularPrice-asc':
          return a.price - b.price;
        case 'regularPrice-desc':
          return b.price - a.price;
        case 'capacity-asc':
          return a.capacity - b.capacity;
        case 'capacity-desc':
          return b.capacity - a.capacity;
        default:
          return 0;
      }
    });
  }

  // دالة تصفية البيانات حسب الحالة
  get filteredCapinData(): Icabins[] {
    const data = this.filteredStatus
      ? this.sortedCabins.filter(
          (p) => p.inventoryStatus === this.filteredStatus
        )
      : this.sortedCabins;

    return data || [];
  }

  applyFilter(status: string) {
    this.filteredStatus = status;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'indiscount':
        return 'success';
      case 'nodiscount':
        return 'warn';
      default:
        return '';
    }
  }

  ngOnInit() {
    this.cabinServ.getCabinsData().subscribe({
      next: (res: any) => {
        this.cabins = res;
        this.sortedCabins = [...res]; // نسخة للفرز
        this.sortData();
      },
    });
=======
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
        label: 'Duplicate',
        icon: 'pi pi-copy m-3 text-xl',
      },
      {
        label: 'Edit cabin',
        icon: 'pi pi-pencil m-3 text-xl',
      },
      {
        label: 'Delete',
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
