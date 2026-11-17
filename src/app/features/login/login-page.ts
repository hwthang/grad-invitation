import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AppButton } from '../../shared/components/button/button';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, AppButton],
  template: `
    <main class="flex min-h-screen items-center justify-center bg-gradient-to-b from-soft to-white px-4 py-12">
      <form
        [formGroup]="form"
        (ngSubmit)="submit()"
        class="w-full max-w-sm rounded-3xl border border-ice bg-white/90 p-8 shadow-card"
        novalidate
      >
        <div class="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-soft text-2xl text-royal">
          <i class="fa-solid fa-graduation-cap" aria-hidden="true"></i>
        </div>
        <h1 class="text-center font-display text-3xl text-navy">Đăng nhập</h1>
        <p class="mt-1 text-center text-sm text-muted">Quản lý thiệp mời tốt nghiệp</p>

        <label for="username" class="mb-1 mt-8 block text-sm font-medium text-navy">Tài khoản</label>
        <input
          id="username"
          formControlName="username"
          autocomplete="username"
          class="w-full rounded-2xl border border-pastel bg-white px-4 py-3 outline-none focus:border-royal focus:shadow-glow"
        />

        <label for="password" class="mb-1 mt-4 block text-sm font-medium text-navy">Mật khẩu</label>
        <input
          id="password"
          type="password"
          formControlName="password"
          autocomplete="current-password"
          class="w-full rounded-2xl border border-pastel bg-white px-4 py-3 outline-none focus:border-royal focus:shadow-glow"
        />

        <p class="mt-3 min-h-6 text-sm text-red-600" role="alert">{{ error() }}</p>

        <app-button class="mt-2" type="submit" [fullWidth]="true">Đăng nhập</app-button>
      </form>
    </main>
  `,
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = new FormGroup({
    username: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  });
  protected readonly error = signal('');

  constructor() {
    if (this.auth.isLoggedIn) void this.router.navigateByUrl('/console');
  }

  protected submit(): void {
    const { username, password } = this.form.getRawValue();
    if (this.auth.login(username, password)) {
      void this.router.navigateByUrl('/console');
    } else {
      this.error.set('Sai tài khoản hoặc mật khẩu.');
    }
  }
}
