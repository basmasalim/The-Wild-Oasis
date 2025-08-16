import { Component, OnInit } from '@angular/core';
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
  imports: [
    TableModule,
    TagModule,
    RatingModule,
    CommonModule,
    ButtonModule,
    FormsModule,
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
  }
}
