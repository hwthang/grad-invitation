import { Component, input } from '@angular/core';
import { GraduationInfo } from '../../../../core/models/graduation-info.model';
import { ResolvedInvitation } from '../../../../core/models/invitation.model';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { ImageFallbackDirective } from '../../../../shared/directives/image-fallback.directive';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-graduate-profile',
  imports: [SectionHeading, RevealDirective, ImageFallbackDirective],
  template: `
    <section appReveal class="bg-white px-4 py-20">
      <div class="mx-auto max-w-5xl">
        <div data-reveal>
          <app-section-heading [heading]="content().heading" [description]="content().description" icon="fa-solid fa-user-graduate" />
        </div>

        <div class="mt-12 grid items-center gap-10 md:grid-cols-2">
          <div data-reveal="left" class="mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-ice shadow-card">
            <img
              [src]="portrait()"
              [alt]="info().graduateName"
              [appImageFallback]="fallbackImage()"
              class="aspect-[4/5] w-full object-cover"
              loading="lazy"
            />
          </div>

          <div data-reveal="right">
            <p class="font-display text-2xl text-navy">{{ content().personalMessage }}</p>

            @if (content().quote) {
              <blockquote class="mt-6 border-l-4 border-sky pl-4 italic text-muted">
                {{ content().quote }}
              </blockquote>
            }

            <dl class="mt-8 space-y-3">
              <div class="flex items-center gap-4 rounded-2xl bg-soft p-4">
                <i class="fa-solid fa-building-columns w-6 text-center text-royal" aria-hidden="true"></i>
                <div>
                  <dt class="text-sm text-muted">{{ content().universityLabel }}</dt>
                  <dd class="font-medium text-navy">{{ info().university }}</dd>
                </div>
              </div>
              <div class="flex items-center gap-4 rounded-2xl bg-soft p-4">
                <i class="fa-solid fa-book-open w-6 text-center text-royal" aria-hidden="true"></i>
                <div>
                  <dt class="text-sm text-muted">{{ content().majorLabel }}</dt>
                  <dd class="font-medium text-navy">{{ info().major }}</dd>
                </div>
              </div>
              <div class="flex items-center gap-4 rounded-2xl bg-soft p-4">
                <i class="fa-solid fa-award w-6 text-center text-royal" aria-hidden="true"></i>
                <div>
                  <dt class="text-sm text-muted">{{ content().yearLabel }}</dt>
                  <dd class="font-medium text-navy">{{ info().graduationYear }}</dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class GraduateProfile {
  readonly content = input.required<ResolvedInvitation['profile']>();
  readonly info = input.required<GraduationInfo>();
  readonly portrait = input.required<string>();
  readonly fallbackImage = input.required<string>();
}
