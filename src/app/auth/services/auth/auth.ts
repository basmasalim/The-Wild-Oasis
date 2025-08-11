import { inject, Injectable } from '@angular/core';
import { USER } from '../../constants/user';
import { User } from '../../interfaces/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly TOKEN_KEY = 'token';
  private readonly router = inject(Router);

  signInUser(user: User): boolean {
    if (user.email === USER.email && user.password === USER.password) {
      this.saveUserDate('token');
      return true;
    }
    return false;
  }
  saveUserDate(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  signOutUser(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }
}
