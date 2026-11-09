import { Routes } from '@angular/router';

export const WELCOME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/welcome-page/welcome-page').then((m) => m.WelcomePage),
  },
];
