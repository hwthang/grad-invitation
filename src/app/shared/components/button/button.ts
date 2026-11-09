import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    @if (href(); as link) {
      <a
        [href]="link"
        target="_blank"
        rel="noopener noreferrer"
        [class]="classes()"
        (click)="clicked.emit()"
      >
        <ng-content />
      </a>
    } @else {
      <button [type]="type()" [class]="classes()" [attr.aria-pressed]="pressed()" (click)="clicked.emit()">
        <ng-content />
      </button>
    }
  `,
  host: { class: 'inline-flex', '[class.w-full]': 'fullWidth()' },
})
export class AppButton {
  readonly variant = input<'primary' | 'secondary'>('primary');
  readonly type = input<'button' | 'submit'>('button');
  readonly href = input<string | null>(null);
  readonly fullWidth = input(false);
  readonly pressed = input<boolean | null>(null);
  readonly clicked = output<void>();

  protected classes(): string {
    const base =
      'inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-medium transition duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] sm:w-auto';
    const tone =
      this.variant() === 'primary'
        ? 'bg-royal text-white shadow-card hover:shadow-glow'
        : 'border border-sky bg-white text-navy hover:bg-ice';
    return `${base} ${tone}`;
  }
}
