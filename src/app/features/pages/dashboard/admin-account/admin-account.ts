import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { ReactiveFormsModule } from '@angular/forms';
import { repeat } from 'rxjs';
import { IUser } from '../../../../core/interfaces/iuser';
import { Admin } from '../../../../core/services/Admin/admin';
import { Loading } from '../../../../core/services/loading/loading';
import { Authintication } from '../../../../auth/services/authintication/authintication';
import { Notifications } from '../../../../core/services/notifications/notifications';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-admin-account',
  imports: [ReactiveFormsModule, FileUploadModule, ProgressSpinnerModule],
  templateUrl: './admin-account.html',
  styleUrl: './admin-account.scss',
})
export class AdminAccount implements OnInit {
  private readonly fb = inject(FormBuilder);
  private accountService = inject(Admin);
  private readonly loadingService = inject(Loading);
  private readonly notifications = inject(Notifications);
  private auth = inject(Authintication);
  accountForm!: FormGroup;
  passswordForm!: FormGroup;
  loading = signal<boolean>(false);

  selectedFile!: File;

  previewUrl = signal<string | ArrayBuffer | null>(this.accountService.userImage());
  private cloudName = 'djnnfcfoe';
  private uploadPreset = 'unsigned_preset';
  ngOnInit(): void {

    this.accountinit();
    this.passwordinit();
  }


  accountinit(): void {
    const current = this.accountService.userAccount();

    this.accountForm = this.fb.group({
      email: [{ value: current?.email || 'admin@example.com', disabled: true }, [Validators.required, Validators.email]],
      fullName: [current?.fullName || 'Admin', Validators.required],
      image: [current?.image || '', Validators.required]
    });
    console.log(current);

  }
  passwordinit(): void {
    this.passswordForm = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator } // خلى بالك: "validators" مش "validator"
    );
  }

  // 🔑 Validator للمقارنة بين الحقول
  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return newPassword && confirmPassword && newPassword === confirmPassword
      ? null
      : { mismatch: true };
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // preview
      const reader = new FileReader();
      reader.onload = e => this.previewUrl.set(reader.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    const res: any = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    }).then(r => r.json());

    return res.secure_url;
  }

  async onSubmitAccount() {

    try {
      this.loadingService.show();
      if (!this.accountForm.valid) {
        this.notifications.showError('Error', ' Form not valid');
        this.loadingService.hide();
        return;
      }

      let imageUrl = this.accountForm.value.image;

      // لو في صورة جديدة ارفعها
      if (this.selectedFile) {
        imageUrl = await this.uploadImage(this.selectedFile);
      }

      const accountData = {
        fullName: this.accountForm.get('fullName')?.value,
        email: this.accountForm.getRawValue().email, // 👈 مهم
        image: imageUrl
      };

      localStorage.setItem('userAccount', JSON.stringify(accountData));
      this.accountService.loadUserFromStorage();
      this.notifications.showSuccess('Success', 'Account updated successfully')

    } catch (error) {
      this.notifications.showError('Error', 'Somthing Wrong');
      this.loadingService.hide();

    } finally {
      // ✅ يقفل بعد ما يخلص سواء نجح أو فشل
      this.loadingService.hide();
    }
  }

  async onSubmitPassword() {
    this.loadingService.show();
    if (this.passswordForm.invalid) return;


    const { oldPassword, newPassword } = this.passswordForm.value;
    const email = this.auth['auth'].currentUser?.email; // current user email

    try {
      const res = await this.auth.changePassword(oldPassword, newPassword);

      if (res.status === 'success') {
        this.notifications.showSuccess('Success', res.message);
        this.passswordForm.reset();
        this.loadingService.hide();
      } else {
        this.notifications.showError('Error', res.message);
        this.loadingService.hide();
      }
    } catch (err) {
      this.notifications.showError('Error', 'Something went wrong');
      this.loadingService.hide();
    }
  }


  onCancel() {
    this.accountForm.reset({
      email: 'admin@gmail.com',
      fullName: 'Admin',
    });
  }
}
