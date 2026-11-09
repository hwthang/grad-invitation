import { NgTemplateOutlet } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  // <ng-content> may only be projected into one place, so both branches render this shared template.
  template: `
    <ng-template #label><ng-content /></ng-template>

    @if (href(); as link) {
      <a
        [href]="link"
        target="_blank"
        rel="noopener noreferrer"
        [class]="classes()"
        (click)="clicked.emit()"
      >
        <ng-container [ngTemplateOutlet]="label" />
      </a>
    } @else {
      <button [type]="type()" [class]="classes()" [attr.aria-pressed]="pressed()" (click)="clicked.emit()">
        <ng-container [ngTemplateOutlet]="label" />
      </button>
    }
  `,
  imports: [NgTemplateOutlet],
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
    const width = this.fullWidth() ? 'w-full' : '';
    const base = `inline-flex ${width} cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 text-center text-base font-medium transition-[translate,scale,box-shadow,background-color] duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]`;
    const tone =
      this.variant() === 'primary'
        ? 'bg-royal text-white shadow-card hover:shadow-glow'
        : 'border border-sky bg-white text-navy hover:bg-ice';
    return `${base} ${tone}`;
  }
}
