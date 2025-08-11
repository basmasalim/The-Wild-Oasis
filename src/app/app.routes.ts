import { Routes } from '@angular/router';

export const routes: Routes = [
  // ?====================> Auth Layout<=================
  {
    path: '',
    loadComponent: () =>
      import('./core/layouts/dashboard/auth-layout/auth-layout').then(
        (c) => c.AuthLayout
      ),
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
