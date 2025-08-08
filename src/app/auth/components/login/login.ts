import { CardModule } from 'primeng/card';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';
import { Subject } from 'rxjs';
import { Notifications } from '../../services/notifications/notifications';
import { ToastModule } from 'primeng/toast';
import { Authintication } from '../../services/auth/authintication';

@Component({
  selector: 'app-login',
  imports: [CardModule, ReactiveFormsModule, ToastModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';

  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Authintication);
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
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.auth.login(email, password).subscribe({
      next: () => {
        console.log('Login successful');

        this.router.navigate(['/']); // بعد تسجيل الدخول روح للهوم
      },
      error: (err) => {
        this.errorMessage = err.message || 'Login failed';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }



  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
