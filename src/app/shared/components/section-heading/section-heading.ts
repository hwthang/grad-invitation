import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-heading',
  template: `
    <div class="mx-auto max-w-2xl text-center">
      @if (icon(); as i) {
        <i [class]="i + ' mb-4 text-2xl text-sky'" aria-hidden="true"></i>
      }
      <h2 class="font-display text-3xl font-medium text-navy sm:text-4xl">{{ heading() }}</h2>
      <div class="mx-auto my-4 h-px w-16 bg-pastel"></div>
    </div>
  `,
})
export class SectionHeading {
  readonly heading = input.required<string>();
  /** Font Awesome classes, e.g. "fa-solid fa-calendar-days" */
  readonly icon = input<string | undefined>();
}
