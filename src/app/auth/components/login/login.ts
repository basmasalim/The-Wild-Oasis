import { CardModule } from 'primeng/card';
import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  Signal,
} from '@angular/core';
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
import { Authintication } from '../../services/authintication/authintication';

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
  loggedIn: Signal<boolean> = computed(() => this.auth.isLogged());
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Authintication);
  private readonly router = inject(Router);
  private readonly notifications = inject(Notifications);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initForm();
    if (localStorage.getItem('loggedIn') === 'true') {
      this.router.navigate(['/dashboard']);
    }
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['admin@example.com', [Validators.required, Validators.email]],
      password: ['123456789', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.notifications.showError(
        'Invalid Form',
        'Please fill in all required fields correctly.'
      );
      return;
    }

    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.auth.login(email, password).subscribe({
        next: () => {
          console.log('Login successful');
          this.auth.isLogged.set(true);
          localStorage.setItem('loggedIn', this.loggedIn() ? 'true' : 'false');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Login failed';
          this.auth.isLogged.set(false);

          this.loading = false;
          this.notifications.showError(
            'Login Failed',
            'Invalid email or password'
          );
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
