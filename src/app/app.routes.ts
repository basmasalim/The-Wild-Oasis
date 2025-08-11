import { Routes } from '@angular/router';
import { AuthLayout } from './core/layouts/dashboard/auth-layout/auth-layout';

export const routes: Routes = [
  // ?====================> Auth Layout<=================
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/components/login/login').then((m) => m.Login),
      },
    ],
  },
];
