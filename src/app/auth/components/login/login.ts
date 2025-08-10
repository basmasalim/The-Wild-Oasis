import { CardModule } from 'primeng/card';
import { Component, computed, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Notifications } from '../../services/notifications/notifications';
import { ToastModule } from 'primeng/toast';
import { Authintcation } from '../../services/authintcation/authintcation';
import { Button } from "primeng/button";

@Component({
  selector: 'app-login',
  imports: [CardModule, ReactiveFormsModule, ToastModule, Button],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  isLoggedIn = () => this.auth.isLogged();
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Authintcation);
  private readonly router = inject(Router);
  private readonly notifications = inject(Notifications);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.notifications.showError('Form Error', 'Please fill in all required fields correctly.');
      return;
    };

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.auth.login(email, password).subscribe({
      next: () => {
        console.log('Login successful');
        this.loginForm.reset();
        this.router.navigate(['/']); // بعد تسجيل الدخول روح للهوم
      },
      error: (err) => {
        this.errorMessage = err.message || 'Login failed';
        this.notifications.showError('Login Error', 'Email or password is incorrect');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => {
        console.log('Logout successful');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.notifications.showError('Logout Error', 'An error occurred while logging out');
        console.error('Logout failed:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
