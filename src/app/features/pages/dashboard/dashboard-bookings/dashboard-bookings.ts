
import { doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { Notifications } from './../../../../auth/services/notifications/notifications';

import { ConfirmationService, MessageService } from 'primeng/api';
import { IBookings } from '../../../../core/interfaces/ibookings';
import { signal } from '@angular/core';
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { BookingStatus } from '../../../../core/enum/booking-status.enum';
import { BOOKING_STATUS_OPTIONS } from '../../../../core/constants/booking.constants';
import { SortingOptions } from '../../../../core/enum/sorting.enum';
import { Bookings } from '../../../../core/services/bookings/bookings';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard-bookings',
  imports: [
    FormsModule,
    TableModule,
    TagModule,
    RatingModule,
    CommonModule,
    Menu,
    ButtonModule,
  ],
  templateUrl: './dashboard-bookings.html',
  styleUrls: ['./dashboard-bookings.scss'],
})
export class DashboardBookings implements OnInit {
  bookings = signal<IBookings[]>([]);
  booking = signal<IBookings>({} as IBookings);
  loading = signal<boolean>(true);
  id: string | undefined = undefined;
  filteredStatus: 'unconfirmed' | 'check in' | 'check out' | '' = '';
  first = 0;
  rows = 5;
  totalRecords = 0;
  constructor(
    private bookingsService: Bookings,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private firestore: Firestore,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getAllBookings();
  }

  getAllBookings() {
    this.loading.set(true);
    this.bookingsService.getBookings().subscribe({
      next: (res) => {
        this.totalRecords = res.length;
        this.bookings.set(
          res.map((booking) => ({
            ...booking,
            inventoryStatus: this.getStatus(booking.startDate, booking.endDate),

          }))

        );

        console.log('📌 bookings:', this.bookings());
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  deleteBooking(id: string) {
    this.bookingsService.deleteBooking(id).subscribe({
      next: () => {
        this.bookings.update((prev) => prev.filter((b) => b.id !== id));
      }
    });
  }
  getStatus(startDate: string, endDate: string): string {
    const today = new Date().toISOString().split('T')[0];

    if (!startDate && !endDate) return 'unconfirmed';
    if (startDate === today && !endDate) return 'check in';
    if (endDate === today) return 'check out';

    // ممكن تزود conditions أكتر لو عاوز
    if (new Date(endDate) < new Date(today)) return 'check out';
    if (new Date(startDate) > new Date(today)) return 'unconfirmed';

    return 'check in';
  }


  getSeverity(inventoryStatus: string): 'success' | 'info' | 'warning' | 'danger' {
    const cleanStatus = inventoryStatus.trim().toLowerCase();
    switch (cleanStatus) {

      case 'Unconfirmed':
        return 'warning';
      case 'check in':
        return 'success';
      case 'check out':
        return 'danger';
      default:
        return 'info';
    }
  }

  async updateStatus(bookingId: string, action: 'check in' | 'check out') {
    try {
      const bookingRef = doc(this.firestore, `bookings/${bookingId}`);
      const today = new Date().toISOString().split('T')[0]; // yyyy-MM-dd

      if (action === 'check in') {
        await updateDoc(bookingRef, { startDate: today });
      }

      if (action === 'check out') {
        await updateDoc(bookingRef, { endDate: today });
      }

      // لازم تستنى هنا علشان Firestore يرجع القيم الجديدة
      this.getAllBookings();

      console.log(`✅ Booking ${bookingId} ${action} updated successfully`);
    } catch (error) {
      console.error('❌ Error updating booking:', error);
    }
  }

  applyFilter(inventoryStatus: 'unconfirmed' | 'check in' | 'check out' | '') {
    this.filteredStatus = inventoryStatus;
  }

  filteredBookings() {
    if (!this.filteredStatus) return this.bookings();
    return this.bookings().filter(b => this.getStatus(b.startDate, b.endDate) === this.filteredStatus);
  }

  confirm2() {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },
      accept: () => {
        if (this.id) {
          this.deleteBooking(this.id);
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
        }
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

  getSpecificBooking(id: string) {
    console.log('Go to booking details for:', id);
    this.bookingsService.getBookingById(id).subscribe({
      next: (res) => {
        this.booking.set(res);
        console.log('Booking details:', this.booking());
      },
      error: (error) => {
        console.error('Error fetching booking details:', error);
      }
    });
  }

  getMenuItems(booking: IBookings): MenuItem[] {
    const inventoryStatus = this.getStatus(booking.startDate, booking.endDate);
    const menuItems: MenuItem[] = [
      {
        label: 'See details',
        icon: 'pi pi-eye mr-2',
        command: () => this.router.navigate(['details/', booking.id])
      },
    ];

    // لو لسه Unconfirmed ولسه معملش Check In
    if (inventoryStatus.toLocaleLowerCase() === 'unconfirmed') {
      menuItems.push({
        label: 'Check In',
        icon: 'pi pi-sign-in mr-2',
        command: () => this.updateStatus(booking.id!, 'check in')
      });
    }

    // لو عمل Check In ولسه معملش Check Out
    if (inventoryStatus === 'check in') {
      menuItems.push({
        label: 'Check Out',
        icon: 'pi pi-sign-out mr-2',
        command: () => this.updateStatus(booking.id!, 'check out')
      });
    }

    // حذف الحجز متاح في أي حالة
    menuItems.push({
      label: 'Delete booking',
      icon: 'pi pi-trash mr-2',
      command: () => {
        this.id = booking.id;
        this.deleteBooking(this.id);
      }
    });

    return menuItems;
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



