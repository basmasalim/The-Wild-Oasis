import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  Component,
  inject,
  signal,
  OnInit,
  WritableSignal,
  computed,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IBookings } from '../../../../core/interfaces/ibookings';
import { Bookings } from '../../../../core/services/bookings/bookings';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Loading } from '../../../../core/services/loading/loading';
import { Notifications } from '../../../../core/services/notifications/notifications';
@Component({
  selector: 'app-booking-details',
  imports: [RouterLink, CurrencyPipe, DatePipe, ConfirmDialog, FormsModule],
  templateUrl: './booking-details.html',
  styleUrl: './booking-details.scss',
})
export class BookingDetails implements OnInit {
  bookId: WritableSignal<string> = signal('');
  statusColor: WritableSignal<string> = signal('');
  check: boolean = false;
  booking = signal<IBookings>({} as IBookings);
  isPaidChecked: WritableSignal<boolean> = signal(false);
  isBreakfastChecked: WritableSignal<boolean> = signal(false);
  locked: WritableSignal<boolean> = signal(false);
  numOfPeople: WritableSignal<number> = signal(0);
  numOfNights: WritableSignal<number> = signal(0);

  private readonly loadingService = inject(Loading);
  private readonly bookingsService = inject(Bookings);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly firestore = inject(Firestore);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly messageService = inject(MessageService);

  status = computed(() => {
    const booking = this.booking();
    if (!booking) {
      return {
        text: 'Unconfirmed',
        bg: 'var(--color-green-100)',
        fg: 'var(--color-green-700)',
        paid: false,
      };
    }

    const today = new Date().setHours(0, 0, 0, 0);
    const start = new Date(booking.startDate).setHours(0, 0, 0, 0);
    const end = new Date(booking.endDate).setHours(0, 0, 0, 0);

    if (today < start)
      return {
        text: 'Unconfirmed',
        bg: 'var(--color-blue-100)',
        fg: 'var(--color-blue-700)',
        paid: false,
      };

    if (today >= start && today <= end)
      return {
        text: 'Check in',
        bg: 'var(--color-green-100)',
        fg: 'var(--color-green-700)',
        paid: true,
      };

    if (today > end)
      return {
        text: 'Check out',
        bg: 'var(--color-silver-100)',
        fg: 'var(--color-silver-700)',
        paid: true,
      };

    return {
      text: 'Unconfirmed',
      bg: 'var(--color-blue-100)',
      fg: 'var(--color-blue-700)',
      paid: false,
    };
  });

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.bookId.set(params['id'] ?? 'status');

      this.getSpecificBooking(this.bookId());
    });
  }

  calculateNumOfNights() {
    const booking = this.booking();

    if (!booking?.startDate || !booking?.endDate) {
      this.numOfNights.set(0);
      return;
    }

    const startDate = new Date(booking.startDate + 'T00:00:00');
    const endDate = new Date(booking.endDate + 'T00:00:00');

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      this.numOfNights.set(0);
      return;
    }

    const timeDiff = endDate.getTime() - startDate.getTime();
    const nights = Math.ceil(Math.abs(timeDiff) / (1000 * 3600 * 24));

    this.numOfNights.set(nights);
  }

  resetForm() {
    this.check = false;
    this.isBreakfastChecked.set(false);
    this.isPaidChecked.set(false);
    this.locked.set(false);
  }

  togglePaid(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.locked.set(false);
    } else {
      this.locked.set(true);
    }
  }

  toggleBreakfast(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.locked.set(true);
      this.isPaidChecked.set(false);
      this.isBreakfastChecked.set(true);
      this.booking().breakFastPrice = 2 * this.numOfPeople(); // Assuming breakfast is $2 per person
    } else {
      this.booking().hasBreakfast = false;
      this.isPaidChecked.set(true);
      this.isBreakfastChecked.set(false);
    }
  }

  getSpecificBooking(id: string) {
    // console.log(this.statusColor());
    // console.log('Go to booking details for:', id);

    this.loadingService.show();

    this.bookingsService.getBookingById(id).subscribe({
      next: (res) => {
        this.isPaidChecked.set(res?.isPaid);
        this.isBreakfastChecked.set(res.hasBreakfast);
        this.numOfPeople.set(res.numGuests + 1); // +1 for the guest
        if (
          this.status().text === 'Check in' ||
          this.status().text === 'Check out'
        ) {
          res.isPaid = true;
        }
        this.booking.set(res);
        console.log(status);

        this.bookingsService.status.set(this.statusColor() || '');
        // console.log('Booking details:', this.booking());
        this.calculateNumOfNights();
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error fetching booking details:', error);
      },
    });
  }

  deleteBooking(id: string) {
    this.loadingService.show();

    this.bookingsService.deleteBooking(id).subscribe({
      next: () => {
        this.router.navigate(['/bookings']);

        // this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Booking deleted successfully!' });
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error deleting booking:', error);
        this.messageService.add({ severity: 'Error', summary: 'Not delete', detail: 'Somthing Wrong When delete!' });
      },
    });
  }

  confirmDelete(event: Event, id: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Danger Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: { severity: 'secondary', outlined: true },
      acceptButtonProps: { severity: 'danger', label: 'Delete' },
      accept: () => {
        this.deleteBooking(this.bookId());
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Booking deleted successfully!',
        });

        this.confirmationService.close(); // 👈 دي اللي بتخفي الـ dialog
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'You have rejected',
        });

        this.confirmationService.close(); // لو عاوز برضه تختفي لما يضغط Cancel
      },
    });
  }


  async updateStatus(bookingId: string, action: 'check in' | 'check out') {
    if (!this.locked()) {
      try {
        const bookingRef = doc(this.firestore, `bookings/${bookingId}`);
        const today = new Date().toISOString().split('T')[0]; // yyyy-MM-dd

        const updateData: any = {};

        if (action === 'check in') {
          updateData.startDate = today;

          if (this.isBreakfastChecked()) {
            updateData.hasBreakfast = true;
            updateData.breakFastPrice =
              this.booking()?.breakFastPrice ?? 2 * this.numOfPeople();
          }

          if (!this.booking()?.isPaid) {
            updateData.isPaid = true;
          }
        }

        if (action === 'check out') {
          updateData.endDate = today;
        }

        await updateDoc(bookingRef, updateData);

        this.booking.update((prev) => ({
          ...prev!,
          ...updateData,
        }));
        this.messageService.add({ severity: 'Confirmed', summary: 'Updated', detail: 'Booking Updated successfully!' });

        this.router.navigate(['/bookings']);
      } catch (error) {
        console.error(error);
        this.messageService.add({ severity: 'Error', summary: 'Updated', detail: 'Failed to update booking status' });

      }
    }
  }
}
