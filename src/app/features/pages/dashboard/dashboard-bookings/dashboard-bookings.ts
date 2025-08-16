import { doc, docData } from '@angular/fire/firestore';
import { Notifications } from './../../../../auth/services/notifications/notifications';

import { ConfirmationService, MessageService } from 'primeng/api';
import { IBookings } from '../../../../core/interfaces/ibookings';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Bookings } from '../../../../core/services/bookings/bookings';

@Component({
  selector: 'app-dashboard-bookings',
  imports: [],
  templateUrl: './dashboard-bookings.html',
  styleUrl: './dashboard-bookings.scss'
})
export class DashboardBookings implements OnInit {
  private readonly bookings = inject(Bookings);
  private readonly notifications = inject(Notifications);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  bookingsList = signal<IBookings[]>([]);
  booking = signal<IBookings | null>(null);
  bookId: string = '';
  ngOnInit() {
    this.getAllBookings();
    this.getSpecificBooking('28mtaFgKTJUseRqAoQOb');

  }

  getStatus(startDate: string, endDate: string): 'unconfirmed' | 'check-in' | 'check-out' {
    const today = new Date().toISOString().split('T')[0];

    if (today < startDate) return 'unconfirmed';
    if (today >= startDate && today <= endDate) return 'check-in';
    else return 'check-out';
  }

  getAllBookings() {

    this.bookings.getBookings().subscribe({
      next: (res) => {

        const updated = res.map((b: any) => ({
          ...b,
          inventoryStatus: this.getStatus(b.startDate, b.endDate)
        }));


        this.bookingsList.set(updated);

        console.log('All Bookings:', this.bookingsList());
      },
      error: (error) => {
        this.notifications.showError('Error fetching bookings', 'Please try again later.');
        console.error('Error fetching bookings:', error);
      }
    });
  }


  getSpecificBooking(id: string) {
    this.bookings.getBookingById(id).subscribe({
      next: (res) => {
        console.log('Booking Details:', res);

      },
      error: (error) => {
        this.notifications.showError('Error fetching booking details', 'Please try again later.');
        console.error('Error fetching booking details:', error);
      }
    });
  }



  deleteBooking(bookingId: string) {
    this.bookId = bookingId;
    this.bookings.deleteBooking(bookingId).subscribe({
      next: () => {
        // this.notifications.showSuccess('Booking deleted successfully', 'The booking has been removed.');
        this.getAllBookings();
      },
      error: (error) => {
        this.notifications.showError('Error deleting booking', 'Please try again later.');
        console.error('Error deleting booking:', error);
      }
    });
  }


  confirm2(event: Event) {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
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
        this.deleteBooking(this.bookId!);
        this.getAllBookings();
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

}