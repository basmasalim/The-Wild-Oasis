import { Cabins } from './../../../../core/services/cabins/cabins';
import { Component, inject, signal } from '@angular/core';
import { Notifications } from '../../../../auth/services/notifications/notifications';
import { Icabins } from '../../../../core/interfaces/icabins';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { doc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-dashboard-cabins',
  imports: [],
  templateUrl: './dashboard-cabins.html',
  styleUrl: './dashboard-cabins.scss'
})
export class DashboardCabins {
  private readonly cabins = inject(Cabins);
  private readonly notifications = inject(Notifications);
  cabinsList = signal<Icabins[]>([]);
  cabinsForm: FormGroup;
  id: string | null = null;
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

  deleteBooking(cabinId: string) {
    this.id = cabinId;
    this.cabins.deleteCabin(cabinId).subscribe({

      next: () => {

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




}
