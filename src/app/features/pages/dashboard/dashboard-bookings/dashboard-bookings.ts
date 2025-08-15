import { Notifications } from './../../../../auth/services/notifications/notifications';

import { MessageService } from 'primeng/api';
import { IBookings } from '../../../../core/interfaces/ibookings';
import { Bookings } from './../../../../auth/services/bookings/bookings';
import { Component, inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard-bookings',
  imports: [],
  templateUrl: './dashboard-bookings.html',
  styleUrl: './dashboard-bookings.scss',
})
export class DashboardBookings implements OnInit {
  // private readonly bookings = inject(Bookings);
  // private readonly notifications = inject(Notifications);
  // bookingsList = signal<IBookings[]>([]);

  ngOnInit() {
    // this.getAllBookings();
    // this.getSpecificBooking('28mtaFgKTJUseRqAoQOb');
  }

  // getAllBookings() {
  //   this.bookings.getBookings().subscribe({
  //     next: (res) => {
  //       this.bookingsList.set(res);
  //       console.log('All Bookings:', this.bookingsList);
  //     },
  //     error: (error) => {
  //       this.notifications.showError('Error fetching bookings', 'Please try again later.');
  //       console.error('Error fetching bookings:', error);
  //     }
  //   })
  // }

  // getSpecificBooking(id: string) {
  //   this.bookings.getBookingById(id).subscribe({
  //     next: (res) => {
  //       console.log('Booking Details:', res);
  //     },
  //     error: (error) => {
  //       this.notifications.showError('Error fetching booking details', 'Please try again later.');
  //       console.error('Error fetching booking details:', error);
  //     }
  //   });
  // }

  // deleteBooking(bookingId: string) {
  //   this.bookings.deleteBooking(bookingId).subscribe({
  //     next: () => {
  //       // this.notifications.showSuccess('Booking deleted successfully', 'The booking has been removed.');
  //       this.getAllBookings();
  //     },
  //     error: (error) => {
  //       this.notifications.showError('Error deleting booking', 'Please try again later.');
  //       console.error('Error deleting booking:', error);
  //     }
  //   });
  // }
}
