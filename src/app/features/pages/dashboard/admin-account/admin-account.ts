import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
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
  selectedFile: File | null = null;

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

  onFileSelect(event: any) {
    this.selectedFile = event.files[0];
  }

  onSubmit() {
    if (this.accountForm.valid) {
      const formData = {
        ...this.accountForm.value,
        avatar: this.selectedFile,
      };
      console.log('Form submitted:', formData);
      // Add your form submission logic here
    }
  }

  onCancel() {
    this.accountForm.reset({
      email: 'alamin@example.com',
      fullName: 'Alamin',
    });
    this.selectedFile = null;
  }
}
