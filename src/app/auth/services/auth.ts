import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { FAKE_USER } from '../constants/fake-user';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly TOKEN_KEY = 'token';

  login(user: User): boolean {
    if (
      user.email === FAKE_USER.email &&
      user.password === FAKE_USER.password
    ) {
      this.setToken('fake-token');
      return true;
    }
    return false;
  }

  logout(): void {
    this.clearToken();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
