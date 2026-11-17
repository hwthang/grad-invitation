import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { AuthService } from './core/services/auth.service';

/** Console pages need the admin login; everyone else is sent back to the login page. */
const requireAdmin: CanActivateFn = () => {
  return inject(AuthService).isLoggedIn || inject(Router).createUrlTree(['/']);
};

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/login/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'console',
    canActivate: [requireAdmin],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/console/console-page').then((m) => m.ConsolePage),
      },
      {
        path: 'edit/:key',
        loadComponent: () => import('./features/console/edit-page').then((m) => m.EditPage),
      },
    ],
  },
  {
    path: 'invitations/:key',
    loadComponent: () =>
      import('./features/invitation/pages/invitation-page/invitation-page').then((m) => m.InvitationPage),
  },
  { path: '**', redirectTo: '' },
];
