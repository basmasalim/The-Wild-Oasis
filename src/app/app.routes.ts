import { Routes } from '@angular/router';
import { AuthLayout } from './core/layouts/dashboard/auth-layout/auth-layout';
import { authGuard } from './core/guards/auth-guard';

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
          import('./auth/components/login/login').then((c) => c.Login),
      },
    ],
  },
  // ?====================> Dashboard Layout<=================
  {
    path: '',
    loadComponent: () =>
      import('./core/layouts/dashboard/dashboard-layout/dashboard-layout').then(
        (c) => c.DashboardLayout
      ),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './features/pages/dashboard/dashboard-home/dashboard-home'
          ).then((c) => c.DashboardHome),
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import(
            './features/pages/dashboard/dashboard-bookings/dashboard-bookings'
          ).then((c) => c.DashboardBookings),
      },
      {
        path: 'cabins',
        loadComponent: () =>
          import(
            './features/pages/dashboard/dashboard-cabins/dashboard-cabins'
          ).then((c) => c.DashboardCabins),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import(
            './features/pages/dashboard/dashboard-settings/dashboard-settings'
          ).then((c) => c.DashboardSettings),
      },
      {
        path: 'users',
        loadComponent: () =>
          import(
            './features/pages/dashboard/dashboard-users/dashboard-users'
          ).then((c) => c.DashboardUsers),
      },
    ],
  },
];
