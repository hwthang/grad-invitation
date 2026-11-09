import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./features/welcome/welcome.routes').then((m) => m.WELCOME_ROUTES),
  },
  {
    path: 'invitation',
    loadChildren: () =>
      import('./features/invitation/invitation.routes').then((m) => m.INVITATION_ROUTES),
  },
  { path: 'welcome', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
