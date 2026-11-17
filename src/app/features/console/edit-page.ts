import { Component, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { defaultInvitation } from '../../core/config/default-invitation.config';
import { themedAsset } from '../../core/config/theme-assets.config';
import { InvitationContent, InvitationTheme } from '../../core/models/invitation.model';
import { InvitationApi } from '../../core/services/invitation-api.service';
import { DEFAULT_AVATAR } from '../../core/services/invitation.service';
import { fileToAvatar } from '../../core/utils/resize-image';
import { AppButton } from '../../shared/components/button/button';
import { Loading } from '../../shared/components/loading/loading';

interface FieldDef {
  /** Path inside InvitationContent, e.g. "hero.greeting". */
  path: string;
  label: string;
  multiline?: boolean;
}

interface FieldGroup {
  title: string;
  fields: FieldDef[];
}

const GROUPS: FieldGroup[] = [
  {
    title: 'Mở đầu',
    fields: [
      { path: 'hero.greeting', label: 'Lời chào' },
      { path: 'hero.message', label: 'Lời mời', multiline: true },
    ],
  },
  {
    title: 'Thông tin buổi lễ',
    fields: [
      { path: 'event.invitationMessage', label: 'Lời mời tham dự' },
    ],
  },
  {
    title: 'Xác nhận tham dự',
    fields: [
      { path: 'rsvp.heading', label: 'Tiêu đề' },
      { path: 'rsvp.attendingButton', label: 'Nút tham gia' },
      { path: 'rsvp.decliningButton', label: 'Nút từ chối' },
      { path: 'rsvp.attendingConfirmation.title', label: 'Cảm ơn (tham gia) - tiêu đề' },
      { path: 'rsvp.attendingConfirmation.message', label: 'Cảm ơn (tham gia) - nội dung', multiline: true },
      { path: 'rsvp.decliningConfirmation.title', label: 'Cảm ơn (từ chối) - tiêu đề' },
      { path: 'rsvp.decliningConfirmation.message', label: 'Cảm ơn (từ chối) - nội dung', multiline: true },
    ],
  },
  {
    title: 'Lời kết',
    fields: [
      { path: 'closing.heading', label: 'Tiêu đề' },
      { path: 'closing.message', label: 'Nội dung', multiline: true },
      { path: 'closing.signature', label: 'Chữ ký' },
      { path: 'closing.additionalMessage', label: 'Lời nhắn thêm (tuỳ chọn)' },
    ],
  },
];

const getPath = (obj: unknown, path: string): string | undefined => {
  let cur: unknown = obj;
  for (const k of path.split('.')) {
    if (typeof cur !== 'object' || cur === null) return undefined;
    cur = (cur as Record<string, unknown>)[k];
  }
  return typeof cur === 'string' ? cur : undefined;
};

const setPath = (obj: Record<string, unknown>, path: string, value: string): void => {
  const keys = path.split('.');
  let cur = obj;
  for (const k of keys.slice(0, -1)) cur = (cur[k] ??= {}) as Record<string, unknown>;
  cur[keys[keys.length - 1]] = value;
};

/** Console: edit one invitation (/console/edit/:key). */
@Component({
  selector: 'app-edit-page',
  imports: [ReactiveFormsModule, RouterLink, AppButton, Loading],
  template: `
    <main class="min-h-screen bg-soft px-4 py-8">
      <div class="mx-auto max-w-3xl">
        <a routerLink="/console" class="text-sm text-royal"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Danh sách thiệp</a>

        @if (missing()) {
          <p class="mt-8 rounded-2xl bg-white p-6 text-center text-red-600 shadow-card" role="alert">Không tìm thấy thiệp.</p>
        } @else if (!loaded()) {
          <div class="mt-12 flex justify-center"><app-loading /></div>
        } @else {
          <form [formGroup]="form" (ngSubmit)="save()" class="mt-4 space-y-6" novalidate>
            <h1 class="font-display text-3xl text-navy">Sửa thiệp: {{ key() }}</h1>

            <section class="rounded-3xl bg-white p-6 shadow-card">
              <h2 class="font-display text-xl text-navy">Khách mời</h2>
              <div class="mt-4 flex items-center gap-5">
                <img [src]="avatarPreview()" alt="Avatar" class="size-24 shrink-0 rounded-full border-4 border-white object-cover shadow-card" />
                <div class="space-y-2 text-sm">
                  <label class="inline-block cursor-pointer rounded-full bg-royal px-4 py-2 text-white">
                    Chọn ảnh
                    <input type="file" accept="image/*" class="sr-only" (change)="pickAvatar($event)" />
                  </label>
                  @if (avatar()) {
                    <button type="button" class="ml-2 cursor-pointer text-red-600" (click)="avatar.set('')">Bỏ ảnh</button>
                  }
                </div>
              </div>
              <div class="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label for="f-name" class="mb-1 block text-sm font-medium text-navy">Tên khách</label>
                  <input id="f-name" formControlName="name" class="w-full rounded-2xl border border-pastel px-4 py-2.5 outline-none focus:border-royal" />
                </div>
                <div>
                  <label for="f-theme" class="mb-1 block text-sm font-medium text-navy">Màu</label>
                  <select id="f-theme" formControlName="theme" class="w-full rounded-2xl border border-pastel bg-white px-4 py-2.5 outline-none focus:border-royal">
                    <option value="blue">Xanh</option>
                    <option value="pink">Hồng</option>
                  </select>
                </div>
              </div>
            </section>

            <div formGroupName="content" class="space-y-6">
              @for (g of groups; track g.title) {
                <section class="rounded-3xl bg-white p-6 shadow-card">
                  <h2 class="font-display text-xl text-navy">{{ g.title }}</h2>
                  <p class="text-sm text-muted">Để trống để dùng nội dung mặc định.</p>
                  <div class="mt-4 space-y-4">
                    @for (f of g.fields; track f.path) {
                      <div>
                        <label [for]="'c-' + f.path" class="mb-1 block text-sm font-medium text-navy">{{ f.label }}</label>
                        @if (f.multiline) {
                          <textarea [id]="'c-' + f.path" [formControlName]="f.path" rows="3" [placeholder]="placeholder(f.path)" class="w-full rounded-2xl border border-pastel px-4 py-2.5 outline-none focus:border-royal"></textarea>
                        } @else {
                          <input [id]="'c-' + f.path" [formControlName]="f.path" [placeholder]="placeholder(f.path)" class="w-full rounded-2xl border border-pastel px-4 py-2.5 outline-none focus:border-royal" />
                        }
                      </div>
                    }
                  </div>
                </section>
              }
            </div>

            <p class="min-h-6 text-sm" [class]="saveError() ? 'text-red-600' : 'text-green-700'" role="status">{{ saveError() || saveMessage() }}</p>
            <div class="sticky bottom-4 flex gap-2">
              <app-button type="submit">Lưu thay đổi</app-button>
              <app-button variant="secondary" (clicked)="preview()">Xem thiệp</app-button>
            </div>
          </form>
        }
      </div>
    </main>
  `,
})
export class EditPage {
  /** Route param, bound through withComponentInputBinding. */
  readonly key = input.required<string>();

  private readonly api = inject(InvitationApi);
  private readonly router = inject(Router);

  protected readonly groups = GROUPS;
  protected readonly loaded = signal(false);
  protected readonly missing = signal(false);
  protected readonly avatar = signal('');
  protected readonly saveMessage = signal('');
  protected readonly saveError = signal('');

  private readonly contentControls: Record<string, FormControl<string>> = Object.fromEntries(
    GROUPS.flatMap((g) => g.fields).map((f) => [f.path, new FormControl('', { nonNullable: true })]),
  );
  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    theme: new FormControl<InvitationTheme>('blue', { nonNullable: true }),
    content: new FormGroup(this.contentControls),
  });

  constructor() {
    queueMicrotask(() => this.load());
  }

  protected avatarPreview(): string {
    return this.avatar() || themedAsset(DEFAULT_AVATAR, this.form.controls.theme.value);
  }

  protected placeholder(path: string): string {
    return getPath(defaultInvitation, path) ?? '';
  }

  private load(): void {
    this.api.get(this.key()).subscribe({
      next: (inv) => {
        this.form.controls.name.setValue(inv.name);
        this.form.controls.theme.setValue(inv.theme);
        this.avatar.set(inv.avatar ?? '');
        for (const [path, control] of Object.entries(this.contentControls)) {
          control.setValue(getPath(inv.content, path) ?? '');
        }
        this.loaded.set(true);
      },
      error: () => this.missing.set(true),
    });
  }

  protected async pickAvatar(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      this.avatar.set(await fileToAvatar(file));
    } catch {
      this.saveError.set('Không đọc được ảnh này.');
    }
  }

  protected save(): void {
    const name = this.form.controls.name.value.trim();
    if (!name) return this.saveError.set('Vui lòng nhập tên khách.');

    const content: Record<string, unknown> = {};
    for (const [path, control] of Object.entries(this.contentControls)) {
      const v = control.value.trim();
      if (v) setPath(content, path, v);
    }

    this.saveError.set('');
    this.saveMessage.set('');
    this.api
      .update(this.key(), {
        name,
        theme: this.form.controls.theme.value,
        avatar: this.avatar() || undefined,
        content: content as InvitationContent,
      })
      .subscribe({
        next: () => this.saveMessage.set('Đã lưu.'),
        error: () => this.saveError.set('Không lưu được. Hãy thử lại.'),
      });
  }

  protected preview(): void {
    window.open(this.router.serializeUrl(this.router.createUrlTree(['/invitations', this.key()])), '_blank');
  }
}
