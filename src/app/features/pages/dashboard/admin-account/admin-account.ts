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

@Component({
  selector: 'app-admin-account',
  imports: [ReactiveFormsModule, FileUploadModule],
  templateUrl: './admin-account.html',
  styleUrl: './admin-account.scss',
})
export class AdminAccount implements OnInit {
  private readonly fb = inject(FormBuilder);
  private accountService = inject(Admin);
  private readonly notifications = inject(Notifications);
  private auth = inject(Authintication);
  accountForm!: FormGroup;
  passswordForm!: FormGroup;
  loading = signal<boolean>(false);

  selectedFile!: File;
  private readonly loadingService = inject(Loading);
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
      email: [{ value: current?.email || 'admin@gmail.com', disabled: true }, [Validators.required, Validators.email]],
      fullName: [current?.fullName || 'Admin', Validators.required],
      image: [current?.image || '', Validators.required]
    });
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
    this.loadingService.show(); // ✅ أول ما يضغط يبدأ اللودينج

    try {
      if (!this.accountForm.valid) {
        console.log('❌ Form not valid');
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
      console.log('✅ Account updated:', accountData);

    } catch (error) {
      console.error('❌ Error updating account:', error);

    } finally {
      // ✅ يقفل بعد ما يخلص سواء نجح أو فشل
      this.loadingService.hide();
    }
  }

  async onSubmitPassword() {
    if (this.passswordForm.invalid) return;


    const { oldPassword, newPassword } = this.passswordForm.value;
    const email = this.auth['auth'].currentUser?.email; // current user email

    try {
      const res = await this.auth.changePassword(oldPassword, newPassword);

      if (res.status === 'success') {
        this.notifications.showSuccess('Success', res.message);
        this.passswordForm.reset();
      } else {
        this.notifications.showError('Error', res.message);
      }
    } catch (err) {
      this.notifications.showError('Error', 'Something went wrong');
    }
  }


  onCancel() {
    this.accountForm.reset({
      email: 'admin@gmail.com',
      fullName: 'Admin',
    });
  }
}
