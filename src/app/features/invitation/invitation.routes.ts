import { Routes } from '@angular/router';

export const INVITATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/invitation-page/invitation-page').then((m) => m.InvitationPage),
  },
];
