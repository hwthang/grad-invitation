import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'welcome' },
  {
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome').then((m) => m.Welcome),
  },
  {
    path: 'invitation',
    loadComponent: () => import('./pages/invitation/invitation').then((m) => m.Invitation),
  },
  { path: '**', redirectTo: 'welcome' },
];
