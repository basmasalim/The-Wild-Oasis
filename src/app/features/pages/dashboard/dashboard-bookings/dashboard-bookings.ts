import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Iguest } from '../../../../core/interfaces/iguest';
import { FilterStatusPipe } from '../../../../core/pipe/filter-status-pipe';
import { GuestUserData } from '../../../../core/services/guest-data/guest-data';

@Component({
  selector: 'app-dashboard-bookings',
  imports: [
    FormsModule,
    TableModule,
    TagModule,
    RatingModule,
    ButtonModule,
    CommonModule,
    FilterStatusPipe,
  ],
  templateUrl: './dashboard-bookings.html',
  styleUrls: ['./dashboard-bookings.scss'],
})
export class DashboardBookings implements OnInit {
  userData: Iguest[] = [];
  first = 0;
  rows = 5;
  filteredStatus = '';
  totalRecords = 0;

  private readonly guestUserData = inject(GuestUserData);

  ngOnInit() {
    this.guestDataInit();
  }

  guestDataInit(): void {
    this.guestUserData.getGuestDataMini().subscribe({
      next: (res: Iguest[]) => {
        this.userData = res;
        this.totalRecords = res.length;
      },
    });
  }

  applyFilter(status: string) {
    this.filteredStatus = status;
    this.first = 0;
  }

  getSeverity(status: Iguest['inventoryStatus']): string {
    switch (status) {
      case 'checkedin':
        return 'success';
      case 'unconfirmed':
        return 'warn';
      case 'checkedout':
        return 'danger';
      default:
        return '';
    }
  }

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
