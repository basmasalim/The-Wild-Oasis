import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Notifications } from '../../../../core/services/notifications/notifications';

@Component({
  selector: 'app-dashboard-users',
  imports: [ReactiveFormsModule],
  templateUrl: './dashboard-users.html',
  styleUrl: './dashboard-users.scss',
})
export class DashboardUsers implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly notification = inject(Notifications);
  userForm!: FormGroup;

  ngOnInit(): void {
    this.createUser();
  }

  createUser(): void {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeatPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.notification.showSuccess('Success', 'User created successfully')
      this.userForm.reset()
    }

  }

  onCancel() {

    this.userForm.reset();
  }
}
