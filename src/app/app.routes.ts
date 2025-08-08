import { Routes } from '@angular/router';

export const routes: Routes = [
  // ?====================> Auth Layout<=================
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/components/login/login').then((m) => m.Login),
  },
];
