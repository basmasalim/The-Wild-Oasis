import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { ConfirmationService, MenuItem } from 'primeng/api';
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
import { BOOKING_STATUS_OPTIONS } from '../../../../core/constants/booking.constants';
import { Notifications } from '../../../../core/services/notifications/notifications';

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
  ],
  templateUrl: './dashboard-bookings.html',
  styleUrls: ['./dashboard-bookings.scss'],
})
export class DashboardBookings implements OnInit {
  bookings = signal<IBookings[]>([]);
  booking = signal<IBookings>({} as IBookings);
  loading = signal<boolean>(true);
  menuItems: { [key: string]: MenuItem[] } = {};
  filteredStatus: 'unconfirmed' | 'check in' | 'check out' | '' = '';
  statusFilters = BOOKING_STATUS_OPTIONS;
  totalRecords = 0;
  first = 0;
  rows = 10;

  private readonly bookingsService = inject(Bookings);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly firestore = inject(Firestore);
  private readonly router = inject(Router);
  private readonly loadingService = inject(Loading);
  private readonly notifications = inject(Notifications);

  ngOnInit(): void {
    this.getAllBookings();
    this.preparingTheMenu();
  }

  getAllBookings() {
    this.loading.set(true);
    this.loadingService.show();
    this.bookingsService.getBookings().subscribe({
      next: (res) => {
        const today = new Date().toISOString().split('T')[0];
        const now = new Date(today);

        res.forEach((b) => {
          const start = new Date(b.startDate);
          const end = new Date(b.endDate);

          if (!b.startDate && !b.endDate) {
            b.inventoryStatus = 'unconfirmed';
            b.severity = 'warning';
          } else if (start <= now && end >= now) {
            b.inventoryStatus = 'check in';
            b.isPaid = true;
            b.severity = 'success';
          } else if (end < now) {
            b.inventoryStatus = 'check out';
            b.severity = 'danger';
          } else if (start > now) {
            b.inventoryStatus = 'unconfirmed';
            b.severity = 'warning';
          }
        });

        this.totalRecords = res.length;
        this.bookings.set(res);
        this.loadingService.hide();
        this.loading.set(false);
        console.log(res);

      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  filteredBookings() {
    if (!this.filteredStatus) return this.bookings();
    return this.bookings().filter(
      (b) => this.getStatus(b.startDate, b.endDate) === this.filteredStatus
    );
  }

  applyFilter(status: string): void {
    this.filteredStatus = status as
      | 'unconfirmed'
      | 'check in'
      | 'check out'
      | '';
    this.first = 0; // reset paginator
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
        this.notifications.deletedError('Confirmed', 'Record deleted');
      },
      reject: () => {
        this.notifications.showError('Rejected', 'You have rejected');
      },
    });
  }

  getStatus(startDate: string, endDate: string): string {
    const today = new Date().toISOString().split('T')[0];
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const now = new Date(today);

    if (!start && !end) {
      return 'unconfirmed';
    }


    if (end && end <= now) {
      return 'check out';
    }


    if (start && start <= now && (!end || end >= now)) {
      return 'check in';
    }


    if (start && start > now) {
      return 'unconfirmed';
    }

    return 'unconfirmed';
  }


  getSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
    switch (status.toLowerCase()) {
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

  preparingTheMenu() {
    this.bookingsService.getBookings().subscribe({
      next: (res) => {
        this.totalRecords = res.length;
        this.bookings.set(res);

        res.forEach((b) => {
          this.menuItems[b.id!] = this.getMenuItems(b);
        });

        this.loadingService.hide();
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  getMenuItems(booking: IBookings): MenuItem[] {
    const status = this.getStatus(booking.startDate, booking.endDate);

    return [
      {
        label: 'See details',
        icon: 'pi pi-eye mr-2',
        command: () => {
          this.router.navigate(['details', booking.id]);
        },
      },
      ...(status === 'unconfirmed'
        ? [
          {
            label: 'Check In',
            icon: 'pi pi-sign-in mr-2',
            command: () => this.updateStatus(booking.id!, 'check in'),
          },
        ]
        : []),
      ...(status === 'check in'
        ? [
          {
            label: 'Check Out',
            icon: 'pi pi-sign-out mr-2',
            command: () => this.updateStatus(booking.id!, 'check out'),
          },
        ]
        : []),
      {
        label: 'Delete booking',
        icon: 'pi pi-trash mr-2',
        command: (event) =>
          this.confirmDelete(event.originalEvent as Event, booking.id),
      },
    ];
  }

  onClick(event: any) {
    this.first = event.first;
  }
}
