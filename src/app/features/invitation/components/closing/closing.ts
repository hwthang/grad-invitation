import { Component, input } from '@angular/core';
import { ResolvedInvitation } from '../../../../core/models/invitation.model';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-closing',
  imports: [RevealDirective],
  template: `
    <div appReveal class="text-center">
      <div>
        <i data-reveal class="fa-solid fa-graduation-cap mb-4 text-3xl text-royal" aria-hidden="true"></i>
        <h2 data-reveal class="font-display text-2xl font-medium text-navy sm:text-3xl">{{ content().heading }}</h2>
        <p data-reveal class="mt-5 text-lg text-ink/80">{{ content().message }}</p>

        @if (content().additionalMessage) {
          <p data-reveal class="mt-4 italic text-muted">{{ content().additionalMessage }}</p>
        }

        <div data-reveal class="mt-6">
          <p class="text-muted">{{ content().signature }}</p>
          <p class="mt-1 font-display text-3xl italic text-navy">{{ graduateName() }}</p>
        </div>
      </div>
    </div>
  `,
})
export class Closing {
  readonly content = input.required<ResolvedInvitation['closing']>();
  readonly graduateName = input.required<string>();
}
