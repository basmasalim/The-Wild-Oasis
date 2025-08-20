import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal, OnInit, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IBookings } from '../../../../core/interfaces/ibookings';
import { Bookings } from '../../../../core/services/bookings/bookings';

import { get } from 'http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
@Component({
  selector: 'app-booking-details',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './booking-details.html',
  styleUrl: './booking-details.scss'
})
export class BookingDetails implements OnInit {
  constructor(
    private bookingsService: Bookings,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private firestore: Firestore,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }
  bookId: WritableSignal<string> = signal('');
  booking = signal<IBookings>({} as IBookings);
  numOfNights: WritableSignal<number> = signal(0);
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.bookId.set(params['id']);
      this.getSpecificBooking(this.bookId());
    });
  }
  calculateNumOfNights() {
    const booking = this.booking();

    if (!booking?.startDate || !booking?.endDate) {
      this.numOfNights.set(0);
      return;
    }

    // نضيف T00:00:00 عشان نضمن إنها تتقرأ كـ تاريخ صحيح
    const startDate = new Date(booking.startDate + "T00:00:00");
    const endDate = new Date(booking.endDate + "T00:00:00");

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {

      this.numOfNights.set(0);
      return;
    }

    const timeDiff = endDate.getTime() - startDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));


    this.numOfNights.set(nights);
  }


  getSpecificBooking(id: string) {
    console.log('Go to booking details for:', id);
    this.bookingsService.getBookingById(id).subscribe({
      next: (res) => {
        this.booking.set(res);
        console.log('Booking details:', this.booking());
        this.calculateNumOfNights();
      },
      error: (error) => {
        console.error('Error fetching booking details:', error);
      }
    });
  }



  deleteBooking(id: string) {
    this.bookingsService.deleteBooking(id).subscribe({
      next: () => {

        this.router.navigate(['/dashboard/bookings']);
      }
    });
  }

  confirm2(event: Event | undefined, id: string) {
    this.confirmationService.confirm({
      target: event!.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Danger Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.deleteBooking(id);         // Refresh the list
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      },
    });
  }

  async updateStatus(bookingId: string, action: 'check in') {

    const bookingRef = doc(this.firestore, `bookings/${bookingId}`);
    const today = new Date().toISOString().split('T')[0]; // yyyy-MM-dd

    if (action === 'check in') {
      await updateDoc(bookingRef, { startDate: today });

    }

  }
}