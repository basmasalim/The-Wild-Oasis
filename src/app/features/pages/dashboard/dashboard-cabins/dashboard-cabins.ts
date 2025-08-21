import { ChangeDetectorRef, signal } from '@angular/core';
import { Notifications } from '../../../../auth/services/notifications/notifications';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Cabins } from '../../../../core/services/cabins/cabins';
import { Icabins } from '../../../../core/interfaces/icabins';
import { MenuItem } from 'primeng/api';
import { SORTING_OPTIONS } from '../../../../core/constants/sorting.constants';
import { DISCOUNT_CONSTANTS } from '../../../../core/constants/discount.constants';
import { Discount } from '../../../../core/enum/discount.emum';
import { Menu } from 'primeng/menu';
import { DialogComponent } from '../../../../shared/components/business/dialog/dialog';
import { Loading } from '../../../../core/services/loading/loading';
import { FilterDiscountPipe } from '../../../../core/pipe/filter-discount/filter-discount-pipe';

@Component({
  selector: 'app-dashboard-cabins',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    RatingModule,
    CommonModule,
    ButtonModule,
    FilterDiscountPipe,
    Menu,
    DialogComponent,
    ConfirmDialogModule,
  ],
  templateUrl: './dashboard-cabins.html',
  styleUrl: './dashboard-cabins.scss',
})
export class DashboardCabins {
  private readonly cabins = inject(Cabins);
  private readonly notifications = inject(Notifications);
  cabinsList = signal<Icabins[]>([]);
  selectedCabin: Icabins | null = null;
  id: string | undefined = undefined;
  first = 0;
  rows = 5;
  totalRecords = 0;
  visible: boolean = false;
  backgroundColor = 'var(--color-grey-50)';
  filteredStatus: Discount | 'all' = 'all';
  discountOptions = DISCOUNT_CONSTANTS;
  sortOptions = SORTING_OPTIONS;
  items: MenuItem[] | undefined;

  private readonly loadingService = inject(Loading);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly firestore = inject(Firestore);
  private readonly messageService = inject(MessageService);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.getAllCabins();
  }

  getAllCabins() {
    this.loadingService.show();

    this.cabins.getCabins().subscribe({
      next: (cabins) => {
        this.cabinsList.set(cabins);
        this.totalRecords = cabins.length;
        this.loadingService.hide();
      },
      error: (error) => {
        this.notifications.showError(
          'Error fetching cabins',
          'Please try again later.'
        );
      },
    });
  }

  deleteCabin(cabinId: string | undefined) {
    if (!cabinId) {
      console.error('Cabin id is missing!');
      return;
    }
    this.id = cabinId;
    this.loadingService.show();
    this.cabins.deleteCabin(cabinId).subscribe({
      next: () => {
        this.loadingService.hide();

        this.getAllCabins();
      },
      error: (error) => {
        this.notifications.showError(
          'Error deleting booking',
          'Please try again later.'
        );
      },
    });
  }

  confirm2(event: Event | undefined, cabinId: string | undefined) {
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
        this.deleteCabin(cabinId); // Refresh the list
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

  applyFilter(status: Discount | 'all') {
    this.filteredStatus = status;
    this.first = 0; // Reset pagination when filter changes
  }

  transform(cabins: Icabins[], status: Discount | 'all'): Icabins[] {
    if (!cabins) return [];

    if (status === 'all') {
      return cabins;
    }

    if (status === Discount.WithDiscount) {
      return cabins.filter((cabin) => cabin.discount > 0);
    }

    if (status === Discount.NoDiscount) {
      return cabins.filter((cabin) => !cabin.discount || cabin.discount === 0);
    }

    return cabins;
  }
  // ?===================> DialogModule
  async onEdit(cabinId: string | undefined) {
    try {
      const docRef = doc(this.firestore, `cabins/${cabinId}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.selectedCabin = { id: docSnap.id, ...docSnap.data() } as Icabins;

        console.log('Cabin loaded:', this.selectedCabin);
      } else {
        console.error('No such cabin!');
      }
    } catch (error) {
      console.error('Error loading cabin:', error);
    }
  }

  getMenuItems(cabin: Icabins): MenuItem[] {
    return [
      {
        label: 'Edit cabin',
        icon: 'pi pi-pencil m-3 text-xl',
        command: () => {
          this.onEdit(cabin.id);
          setTimeout(() => {
            this.showDialog();
            this.cdr.detectChanges(); // Ensure the dialog is updated
          }, 100);
        },
      },
      {
        label: 'Delete booking',
        icon: 'pi pi-trash mr-2',

        command: (event) => this.confirm2(event.originalEvent, cabin.id),
      },
    ];
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

  onDialogClose() {
    this.visible = false;
    this.selectedCabin = null;
    this.getAllCabins();
  }
  showDialog() {
    this.visible = true;
  }
  createCabin() {
    console.log('New cabin created:');
    // Handle API call here
  }
}
