import { Component, input } from '@angular/core';
import { ResolvedInvitation } from '../../../../core/models/invitation.model';
import { ImageFallbackDirective } from '../../../../shared/directives/image-fallback.directive';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-hero',
  imports: [RevealDirective, ImageFallbackDirective],
  template: `
    <section
      appReveal
      [revealOnLoad]="true"
      class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-pastel/60 via-ice to-soft px-4 py-16"
    >
      <div aria-hidden="true" class="pointer-events-none absolute -left-20 top-10 size-72 rounded-full bg-white/50 blur-3xl"></div>
      <div aria-hidden="true" class="pointer-events-none absolute -right-24 bottom-10 size-80 rounded-full bg-sky/20 blur-3xl"></div>

      <div class="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
        <div data-reveal="scale" class="mb-8 size-44 overflow-hidden rounded-full border-4 border-white shadow-card sm:size-56">
          <img
            [src]="image()"
            [alt]="imageAlt()"
            appImageFallback="/assets/images/default-guest.svg"
            class="size-full object-cover"
          />
        </div>

        <p data-reveal class="font-display text-2xl italic text-royal sm:text-3xl">{{ content().greeting }}</p>
        <h1 data-reveal class="mt-4 font-display text-3xl font-medium leading-snug text-navy sm:text-4xl">
          {{ content().message }}
        </h1>
        <p data-reveal class="mt-5 text-lg text-muted">{{ content().subtitle }}</p>

        <i data-reveal class="fa-solid fa-graduation-cap mt-10 text-3xl text-sky" aria-hidden="true"></i>
      </div>
    </section>
  `,
})
export class Hero {
  readonly content = input.required<ResolvedInvitation['hero']>();
  readonly image = input.required<string>();
  readonly imageAlt = input('');
}
