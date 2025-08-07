import { CardModule } from 'primeng/card';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [CardModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  error = '';

  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['admin@example.com', [Validators.required, Validators.email]],
      password: ['123456789', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const user: User = this.loginForm.value;
    const success = this.auth.login(user);

    if (success) {
      // this.router.navigate(['/dashboard']);
      console.log('login success');
    } else {
      console.log('login failed');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
