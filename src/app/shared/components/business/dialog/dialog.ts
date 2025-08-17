import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
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

@Component({
  selector: 'app-dialog',
  imports: [DialogModule, ButtonModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  cabinForm!: FormGroup;
  backgroundColor = 'var(--color-grey-50)';

  ngOnInit(): void {
    this.initCabinForm();
  }

  initCabinForm() {
    this.cabinForm = this.fb.group({
      cabinName: ['', Validators.required],
      max: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.min(0)]],
      description: [''],
      avatar: [null],
    });
  }

  onSubmit() {
    console.log('Form value before submit:', this.cabinForm.value);

    if (this.cabinForm.valid) {
      this.onSave.emit(this.cabinForm.value);
      this.closeDialog();
    } else {
      console.log('Form invalid:', this.cabinForm.errors);
    }
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.cabinForm.reset();
  }

  handleFileUpload(event: any) {
    this.cabinForm.patchValue({
      avatar: event.files[0],
    });
  }

  save() {
    this.onSave.emit();
    this.closeDialog();
  }
}
