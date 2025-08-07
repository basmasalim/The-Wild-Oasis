import { Routes } from '@angular/router';
import { Login } from './auth/components/login/login';

export const routes: Routes = [
  // Login route
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/components/login/login').then((m) => m.Login),
  },
];
