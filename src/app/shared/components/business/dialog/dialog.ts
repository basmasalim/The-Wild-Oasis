import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { addDoc, collection, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Icabins } from '../../../../core/interfaces/icabins';

@Component({
  selector: 'app-dialog',
  imports: [DialogModule, ButtonModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class DialogComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<void>();
  @Input() cabin!: Icabins | null;
  backgroundColor = 'var(--color-grey-50)';
  cabinForm!: FormGroup;
  updateBtn: WritableSignal<boolean> = signal(false);
  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
  ) {

  }
  ngOnInit(): void {
    // ✅ بناء الفورم هنا
    this.cabinForm = this.fb.group({

      name: ['', Validators.required],
      maxCapacity: [1, [Validators.required, Validators.min(1)]],
      regularPrice: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],

      createdAt: [this.getToday()],
    });


  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['cabin'] && this.cabin && this.cabinForm) {
      this.cabinForm.patchValue({
        id: this.cabin.id || '',
        name: this.cabin.name,
        maxCapacity: this.cabin.maxCapacity,
        regularPrice: this.cabin.regularPrice,
        discount: this.cabin.discount,
        description: this.cabin.description,
        inventoryStatus: this.cabin.inventoryStatus,
        createdAt: this.cabin.createdAt
      }); this.cdr.detectChanges();
      this.updateBtn.set(true);
    }
  }

  getToday(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  async onSubmit() {
    if (this.cabinForm.valid) {
      try {
        if (this.cabin?.id) {
          // ✅ Update
          const cabinRef = doc(this.firestore, 'cabins', this.cabin.id);
          await updateDoc(cabinRef, this.cabinForm.value);
          this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Cabin updated successfully!' });
        } else {
          // ✅ Add
          const cabinsCollection = collection(this.firestore, 'cabins');
          await addDoc(cabinsCollection, this.cabinForm.value);
          this.messageService.add({ severity: 'success', summary: 'Added', detail: 'Cabin added successfully!' });
        }

        this.onSave.emit();
        this.closeDialog();
      } catch (error) {
        console.error('Error saving cabin:', error);
      }
    }
  }

  closeDialog() {
    this.visible = false;
    this.cabin = null; // Reset cabin data
    this.visibleChange.emit(this.visible);
    this.cabinForm.reset();
  }
}
