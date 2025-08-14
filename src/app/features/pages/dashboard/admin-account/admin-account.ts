import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-account',
  imports: [ReactiveFormsModule, FileUploadModule],
  templateUrl: './admin-account.html',
  styleUrl: './admin-account.scss',
})
export class AdminAccount implements OnInit {
  private readonly fb = inject(FormBuilder);
  accountForm!: FormGroup;

  ngOnInit(): void {
    this.accountinit();
  }

  accountinit(): void {
    this.accountForm = this.fb.group(
      {
        email: [
          { value: 'admin@gmail.com', disabled: true },
          [Validators.required, Validators.email],
        ],
        fullName: ['Admin', Validators.required],
        password: ['', [Validators.minLength(8)]],
        confirmPassword: [''],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.accountForm.valid) {
      console.log('Form submitted:');
      // Add your form submission logic here
    }
  }

  onCancel() {
    this.accountForm.reset({
      email: 'admin@gmail.com',
      fullName: 'Admin',
    });
  }
}
