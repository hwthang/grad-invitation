import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Address, Invitation, InvitationTheme, RSVPStatus } from '../../core/models/invitation.model';
import { AuthService } from '../../core/services/auth.service';
import { InvitationApi } from '../../core/services/invitation-api.service';
import { DEFAULT_AVATAR } from '../../core/services/invitation.service';
import { ADDRESS_LABELS, ADDRESS_OPTIONS } from '../../core/config/default-invitation.config';
import { themedAsset } from '../../core/config/theme-assets.config';
import { STATUS_LABEL, downloadText, rsvpToCsv, rsvpToJson } from '../../core/utils/export-rsvp';
import { KEY_PATTERN, slugify } from '../../core/utils/slugify';
import { AppButton } from '../../shared/components/button/button';
import { Loading } from '../../shared/components/loading/loading';

@Component({
  selector: 'app-console-page',
  imports: [ReactiveFormsModule, RouterLink, AppButton, Loading],
  template: `
    <main class="min-h-screen bg-soft px-4 py-8">
      <div class="mx-auto max-w-5xl">
        <header class="flex flex-wrap items-center justify-between gap-3">
          <h1 class="font-display text-3xl text-navy">Quản lý thiệp mời</h1>
          <div class="flex flex-wrap gap-2">
            <app-button (clicked)="toggleForm()">
              <i class="fa-solid fa-plus" aria-hidden="true"></i> Thêm thiệp
            </app-button>
            <app-button variant="secondary" (clicked)="exportCsv()">
              <i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i> Xuất CSV
            </app-button>
            <app-button variant="secondary" (clicked)="exportJson()">
              <i class="fa-solid fa-file-code" aria-hidden="true"></i> Xuất JSON
            </app-button>
            <app-button variant="secondary" (clicked)="logout()">Đăng xuất</app-button>
          </div>
        </header>

        @if (items(); as list) {
          <p class="mt-4 text-sm text-muted">
            Tổng {{ list.length }} · Tham gia
            <strong class="text-navy">{{ count('ATTENDING') }}</strong> · Không tham gia
            <strong class="text-navy">{{ count('NOT_ATTENDING') }}</strong> · Chưa phản hồi
            <strong class="text-navy">{{ count('PENDING') }}</strong>
          </p>
        }

        @if (showForm()) {
          <form [formGroup]="form" (ngSubmit)="create()" class="mt-6 rounded-3xl bg-white p-6 shadow-card" novalidate>
            <h2 class="font-display text-xl text-navy">Thiệp mới</h2>
            <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label for="new-name" class="mb-1 block text-sm font-medium text-navy">Tên khách</label>
                <input id="new-name" formControlName="name" class="w-full rounded-2xl border border-pastel px-4 py-2.5 outline-none focus:border-royal" />
              </div>
              <div>
                <label for="new-key" class="mb-1 block text-sm font-medium text-navy">Key (đường dẫn)</label>
                <input id="new-key" formControlName="key" placeholder="vd: nguyen-van-a" class="w-full rounded-2xl border border-pastel px-4 py-2.5 outline-none focus:border-royal" />
              </div>
              <div>
                <label for="new-address" class="mb-1 block text-sm font-medium text-navy">Xưng hô</label>
                <select id="new-address" formControlName="address" class="w-full rounded-2xl border border-pastel bg-white px-4 py-2.5 outline-none focus:border-royal">
                  @for (a of addresses; track a) {
                    <option [value]="a">{{ addressLabels[a] }}</option>
                  }
                </select>
              </div>
              <div>
                <label for="new-theme" class="mb-1 block text-sm font-medium text-navy">Màu</label>
                <select id="new-theme" formControlName="theme" class="w-full rounded-2xl border border-pastel bg-white px-4 py-2.5 outline-none focus:border-royal">
                  <option value="blue">Xanh</option>
                  <option value="pink">Hồng</option>
                </select>
              </div>
            </div>
            <p class="mt-3 min-h-6 text-sm text-red-600" role="alert">{{ formError() }}</p>
            <div class="mt-2 flex gap-2">
              <app-button type="submit">Xác nhận tạo</app-button>
              <app-button variant="secondary" (clicked)="toggleForm()">Huỷ</app-button>
            </div>
          </form>
        }

        @if (loadError()) {
          <p class="mt-8 rounded-2xl bg-white p-6 text-center text-red-600 shadow-card" role="alert">
            Không tải được dữ liệu. Hãy chắc chắn server đang chạy (npm run api).
          </p>
        } @else if (!items()) {
          <div class="mt-12 flex justify-center"><app-loading /></div>
        } @else if (!items()!.length) {
          <p class="mt-12 text-center text-muted">Chưa có thiệp nào. Bấm “Thêm thiệp” để tạo.</p>
        } @else {
          <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            @for (inv of items(); track inv.key) {
              <li class="flex flex-col rounded-3xl bg-white p-5 shadow-card">
                <div class="flex items-center gap-4">
                  <img [src]="avatar(inv)" alt="" class="size-16 shrink-0 rounded-full border-2 border-white object-cover shadow-card" />
                  <div class="min-w-0">
                    <h2 class="truncate font-medium text-navy">{{ inv.name }}</h2>
                    <p class="truncate text-sm text-muted">/invitations/{{ inv.key }}</p>
                  </div>
                </div>
                <p class="mt-3 text-sm">
                  <span
                    class="rounded-full px-3 py-1"
                    [class]="inv.rsvp.status === 'ATTENDING' ? 'bg-green-100 text-green-800' : inv.rsvp.status === 'NOT_ATTENDING' ? 'bg-red-100 text-red-800' : 'bg-ice text-muted'"
                  >{{ label[inv.rsvp.status] }}</span>
                </p>
                <div class="mt-4 flex flex-wrap gap-2 text-sm">
                  <a [routerLink]="['/console/edit', inv.key]" class="rounded-full bg-royal px-4 py-1.5 text-white">Sửa</a>
                  <a [href]="'/invitations/' + inv.key" target="_blank" rel="noopener" class="rounded-full border border-sky px-4 py-1.5 text-navy">Xem</a>
                  <button type="button" (click)="copy(inv)" class="cursor-pointer rounded-full border border-sky px-4 py-1.5 text-navy">
                    {{ copied() === inv.key ? 'Đã chép!' : 'Chép link' }}
                  </button>
                  <button type="button" (click)="remove(inv)" class="ml-auto cursor-pointer px-2 py-1.5 text-red-600" aria-label="Xoá thiệp">
                    <i class="fa-regular fa-trash-can" aria-hidden="true"></i>
                  </button>
                </div>
              </li>
            }
          </ul>
        }
      </div>
    </main>
  `,
})
export class ConsolePage {
  private readonly api = inject(InvitationApi);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly label = STATUS_LABEL;
  protected readonly addresses = ADDRESS_OPTIONS;
  protected readonly addressLabels = ADDRESS_LABELS;
  protected readonly items = signal<Invitation[] | null>(null);
  protected readonly loadError = signal(false);
  protected readonly showForm = signal(false);
  protected readonly formError = signal('');
  protected readonly copied = signal<string | null>(null);

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    key: new FormControl('', { nonNullable: true }),
    theme: new FormControl<InvitationTheme>('blue', { nonNullable: true }),
    address: new FormControl<Address>('ban', { nonNullable: true }),
  });

  private readonly counts = computed(() => {
    const c = { ATTENDING: 0, NOT_ATTENDING: 0, PENDING: 0 };
    for (const i of this.items() ?? []) c[i.rsvp.status]++;
    return c;
  });

  constructor() {
    this.api.list().subscribe({
      next: (list) => this.items.set(list),
      error: () => this.loadError.set(true),
    });
    // Suggest a key from the name until the key is edited by hand.
    this.form.controls.name.valueChanges.subscribe((name) => {
      if (!this.form.controls.key.dirty) this.form.controls.key.setValue(slugify(name), { emitEvent: false });
    });
  }

  protected count(status: RSVPStatus): number {
    return this.counts()[status];
  }

  protected avatar(inv: Invitation): string {
    return inv.avatar || themedAsset(DEFAULT_AVATAR, inv.theme);
  }

  protected toggleForm(): void {
    this.showForm.update((v) => !v);
    this.formError.set('');
    this.form.reset({ name: '', key: '', theme: 'blue', address: 'ban' });
  }

  protected create(): void {
    const { name, key, theme, address } = this.form.getRawValue();
    if (!name.trim()) return this.formError.set('Vui lòng nhập tên khách.');
    if (!KEY_PATTERN.test(key)) return this.formError.set('Key chỉ gồm chữ thường không dấu, số và dấu gạch ngang.');
    if (this.items()?.some((i) => i.key === key)) return this.formError.set('Key này đã tồn tại.');

    this.api.create(key, { name: name.trim(), theme, address }).subscribe({
      next: (inv) => {
        this.items.update((list) => [...(list ?? []), inv]);
        this.showForm.set(false);
      },
      error: (e) => this.formError.set(e.status === 409 ? 'Key này đã tồn tại.' : 'Không tạo được thiệp.'),
    });
  }

  protected remove(inv: Invitation): void {
    if (!confirm(`Xoá thiệp của ${inv.name}?`)) return;
    this.api.remove(inv.key).subscribe({
      next: () => this.items.update((list) => (list ?? []).filter((i) => i.key !== inv.key)),
      error: () => alert('Không xoá được thiệp.'),
    });
  }

  protected async copy(inv: Invitation): Promise<void> {
    try {
      await navigator.clipboard.writeText(`${location.origin}/invitations/${inv.key}`);
      this.copied.set(inv.key);
      setTimeout(() => this.copied.set(null), 1500);
    } catch {
      prompt('Sao chép link:', `${location.origin}/invitations/${inv.key}`);
    }
  }

  protected exportCsv(): void {
    downloadText('danh-sach-khach.csv', rsvpToCsv(this.items() ?? []));
  }

  protected exportJson(): void {
    downloadText('danh-sach-khach.json', rsvpToJson(this.items() ?? []), 'application/json');
  }

  protected logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/');
  }
}
