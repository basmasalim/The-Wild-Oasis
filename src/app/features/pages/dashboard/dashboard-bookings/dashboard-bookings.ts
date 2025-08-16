import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Iguest } from '../../../../core/interfaces/iguest';
import { FilterStatusPipe } from '../../../../core/pipe/filter-status-pipe';
import { GuestUserData } from '../../../../core/services/guest-data/guest-data';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { BookingStatus } from '../../../../core/enum/booking-status.enum';
import { BOOKING_STATUS_OPTIONS } from '../../../../core/constants/booking.constants';
import { SortingOptions } from '../../../../core/enum/sorting.enum';
import { SORTING_OPTIONS } from '../../../../core/constants/sorting.constants';

@Component({
  selector: 'app-dashboard-bookings',
  imports: [
    FormsModule,
    TableModule,
    TagModule,
    RatingModule,
    CommonModule,
    FilterStatusPipe,
    Menu,
    ButtonModule,
  ],
  templateUrl: './dashboard-bookings.html',
  styleUrls: ['./dashboard-bookings.scss'],
})
export class DashboardBookings implements OnInit {
  userData: Iguest[] = [];
  first = 0;
  rows = 5;
  totalRecords = 0;
  filteredStatus: BookingStatus | '' = '';

  statusOptions = BOOKING_STATUS_OPTIONS;
  sortOptions = SORTING_OPTIONS;
  selectedSort: SortingOptions = SortingOptions.DateRecentFirst;

  private readonly guestUserData = inject(GuestUserData);

  ngOnInit(): void {
    this.loadGuestData();
  }

  private loadGuestData(): void {
    this.guestUserData.getGuestDataMini().subscribe({
      next: (res: Iguest[]) => {
        this.userData = res;
        this.totalRecords = res.length;
      },
      error: (err) => console.error('Failed to load guest data', err),
    });
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

  onSortChange() {
    // Implement your sorting logic here
    console.log('Sorting by:', this.selectedSort);
  }

  applyFilter(status: string): void {
    this.filteredStatus = status as BookingStatus | '';
    this.first = 0;
  }

  // ? =============================> Context Menu
  getMenuItems(user: any): MenuItem[] {
    const menuItems: MenuItem[] = [
      {
        label: 'See details',
        icon: 'pi pi-eye mr-2',
        // command: () => this.viewUserDetails(user.id)
      },
    ];

    // Add status change actions directly (no nested menu)
    if (
      user.inventoryStatus !== 'checkedin' &&
      user.inventoryStatus !== 'checkedout'
    ) {
      menuItems.push({
        label: 'Check In',
        icon: 'pi pi-sign-in mr-2',
        // command: () => this.updateStatus(user.id, 'checkedin')
      });
    }

    if (
      user.inventoryStatus !== 'unconfirmed' &&
      user.inventoryStatus !== 'checkedout'
    ) {
      menuItems.push({
        label: 'Check Out',
        icon: 'pi pi-sign-out mr-2',
        // command: () => this.updateStatus(user.id, 'checkedout')
      });
    }

    menuItems.push({
      label: 'Delete booking',
      icon: 'pi pi-trash mr-2',
      // command: () => this.deleteUser(user.id),
    });

    return menuItems;
  }

  //? =============================> Pagination methods
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
