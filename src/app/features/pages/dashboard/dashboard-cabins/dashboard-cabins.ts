
import { signal } from '@angular/core';
import { Notifications } from '../../../../auth/services/notifications/notifications';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { doc, updateDoc } from '@angular/fire/firestore';

import { Component, inject, OnInit } from '@angular/core';
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
import { FilterDiscountPipe } from '../../../../core/pipe/filter-discount/filter-discount-pipe';
import { Menu } from 'primeng/menu';

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
  ],
  templateUrl: './dashboard-cabins.html',
  styleUrl: './dashboard-cabins.scss',
})
export class DashboardCabins {
  private readonly cabins = inject(Cabins);
  private readonly notifications = inject(Notifications);
  cabinsList = signal<Icabins[]>([]);
  cabinsForm: FormGroup;
  id: string | undefined = undefined;
  first = 0;
  rows = 5;
  totalRecords = 0;
  filteredStatus: Discount | 'all' = 'all';
  discountOptions = DISCOUNT_CONSTANTS;
  sortOptions = SORTING_OPTIONS;
  items: MenuItem[] | undefined;
  ngOnInit() {
    this.getAllCabins();
  }
  getToday(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // صيغة yyyy-MM-dd
  }
  constructor(
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private firestore: Firestore,
    private messageService: MessageService
  ) {
    this.cabinsForm = this.fb.group({
      name: ['', Validators.required],
      maxCapacity: [1, [Validators.required, Validators.min(1)]],
      regularPrice: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      image: ['', Validators.required], // ⬅️ إضافة حقل الصورة
      createdAt: this.getToday()
    });
  }


  async onSubmit() {
    if (this.cabinsForm.valid) {
      try {
        const cabinsCollection = collection(this.firestore, 'cabins');
        await addDoc(cabinsCollection, this.cabinsForm.value);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Cabin added successfully!',
        });

        this.cabinsForm.reset({
          createdAt: this.getToday(),
          maxCapacity: 1,
          regularPrice: 0,
          discount: 0,
          image: ''
        });

      } catch (error) {
        console.error('Error adding cabins:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add cabins.',
        });
      }
    } else {
      console.warn('Form is invalid');
    }
  }


  async onUpdate(cabinId: string) {
    if (this.cabinsForm.valid) {
      try {
        const cabinRef = doc(this.firestore, 'cabins', cabinId);

        await updateDoc(cabinRef, this.cabinsForm.value);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Cabin updated successfully!',
        });

        this.cabinsForm.reset({
          createdAt: this.getToday(),
          maxCapacity: 1,
          regularPrice: 0,
          discount: 0,
          image: ''
        });

      } catch (error) {
        console.error('Error updating cabin:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update cabin.',
        });
      }
    } else {
      console.warn('Form is invalid');
    }
  }


  getAllCabins() {
    this.cabins.getCabins().subscribe({
      next: (res) => {
        this.cabinsList.set(res);
        console.log('All cabins:', this.cabinsList());
      },
      error: (error) => {
        this.notifications.showError('Error fetching cabins', 'Please try again later.');
        console.error('Error fetching cabins:', error);
      }
    })
  }

  deleteBooking(cabinId: string | undefined) {
    if (!cabinId) {
      console.error('Cabin id is missing!');
      return;
    }
    this.id = cabinId;
    this.cabins.deleteCabin(cabinId).subscribe({

      next: () => {
        console.log('Booking deleted successfully');


        // this.notifications.showSuccess('Booking deleted successfully', 'The booking has been removed.');
        this.getAllCabins();
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
        this.deleteBooking(this.id!);
        this.getAllCabins();
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
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
      return cabins.filter(cabin => cabin.discount > 0);
    }

    if (status === Discount.NoDiscount) {
      return cabins.filter(cabin => !cabin.discount || cabin.discount === 0);
    }

    return cabins;
  }


  getMenuItems(cabin: Icabins): MenuItem[] {

    return [

      {
        label: 'Edit cabin',
        icon: 'pi pi-pencil mr-2',
      },
      {
        label: 'Delete booking',
        icon: 'pi pi-trash mr-2',

        command: () => this.deleteBooking(cabin.id)   // ✅ هنا تبعت id


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


}

