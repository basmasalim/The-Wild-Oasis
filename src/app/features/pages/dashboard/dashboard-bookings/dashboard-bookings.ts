import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { IBookings } from '../../../../core/interfaces/ibookings';
import { signal, Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Menu } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { Bookings } from '../../../../core/services/bookings/bookings';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Loading } from '../../../../core/services/loading/loading';
import { BookingstatusFilterPipe } from '../../../../core/pipe/booking-status-filter/bookingstatus-filter-pipe';
import { BOOKING_STATUS_OPTIONS } from '../../../../core/constants/booking.constants';

@Component({
  selector: 'app-dashboard-bookings',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    TagModule,
    CommonModule,
    Menu,
    ButtonModule,
    ConfirmDialogModule,
    BookingstatusFilterPipe,
  ],
  templateUrl: './dashboard-bookings.html',
  styleUrls: ['./dashboard-bookings.scss'],
})
export class DashboardBookings implements OnInit {
  bookings = signal<IBookings[]>([]);
  booking = signal<IBookings>({} as IBookings);
  loading = signal<boolean>(true);
  filteredStatus: 'unconfirmed' | 'check in' | 'check out' | '' = '';
  statusFilters = BOOKING_STATUS_OPTIONS;
  totalRecords = 0;
  first = 0;
  rows = 10;

  private readonly bookingsService = inject(Bookings);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly firestore = inject(Firestore);
  private readonly router = inject(Router);
  private readonly loadingService = inject(Loading);

  ngOnInit(): void {
    this.getAllBookings();
  }

  getAllBookings() {
    this.loading.set(true);
    this.loadingService.show();
    this.bookingsService.getBookings().subscribe({
      next: (res) => {
        this.totalRecords = res.length;
        this.bookings.set(res);
        this.loadingService.hide();
        this.loading.set(false);
      },
      error: () => {
        this.loadingService.hide();
        this.loading.set(false);
      },
    });
  }

  applyFilter(status: string): void {
    this.filteredStatus = '';
    this.first = 0;
  }

  deleteBooking(id: string) {
    this.loadingService.show();
    this.bookingsService.deleteBooking(id).subscribe({
      next: () => {
        this.bookings.update((prev) => prev.filter((b) => b.id !== id));
        this.totalRecords--;
        this.loadingService.hide();
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
        this.deleteBooking(id);
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Record deleted',
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }

  getStatus(startDate: string, endDate: string): string {
    const today = new Date().toISOString().split('T')[0];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date(today);

    if (!startDate && !endDate) return 'unconfirmed';
    if (start <= now && end >= now) return 'check in';
    if (end < now) return 'check out';
    if (start > now) return 'unconfirmed';

    return 'unconfirmed';
  }

  getSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
    switch (status.toLowerCase()) {
      case 'unconfirmed':
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
      const today = new Date().toISOString().split('T')[0];

      if (action === 'check in') {
        await updateDoc(bookingRef, { startDate: today });
      } else if (action === 'check out') {
        await updateDoc(bookingRef, { endDate: today });
      }

      this.getAllBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  }

  getMenuItems(booking: IBookings): MenuItem[] {
    const status = this.getStatus(booking.startDate, booking.endDate);
    const items: MenuItem[] = [
      {
        label: 'See details',
        icon: 'pi pi-eye mr-2',
        command: () => this.router.navigate(['details/', booking.id]),
      },
    ];

    if (status === 'unconfirmed') {
      items.push({
        label: 'Check In',
        icon: 'pi pi-sign-in mr-2',
        command: () => this.updateStatus(booking.id!, 'check in'),
      });
    }

    if (status === 'check in') {
      items.push({
        label: 'Check Out',
        icon: 'pi pi-sign-out mr-2',
        command: () => this.updateStatus(booking.id!, 'check out'),
      });
    }

    items.push({
      label: 'Delete booking',
      icon: 'pi pi-trash mr-2',
      command: (event) =>
        this.confirmDelete(event.originalEvent as Event, booking.id),
    });

    return items;
  }
}
