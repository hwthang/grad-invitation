import { Component, computed, input, signal } from '@angular/core';
import { ResolvedInvitation } from '../../../../core/models/invitation.model';
import { ImageLightbox } from '../../../../shared/components/image-lightbox/image-lightbox';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { ImageFallbackDirective } from '../../../../shared/directives/image-fallback.directive';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-graduation-gallery',
  imports: [SectionHeading, ImageLightbox, ImageFallbackDirective, RevealDirective],
  template: `
    @if (images().length) {
      <section appReveal class="bg-white px-4 py-20">
        <div class="mx-auto max-w-5xl">
          <div data-reveal>
            <app-section-heading [heading]="content().heading" [description]="content().description" icon="fa-solid fa-camera-retro" />
          </div>

          <ul class="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            @for (img of images(); track img.id; let i = $index) {
              <li data-reveal="scale">
                <button
                  type="button"
                  class="group block w-full cursor-pointer overflow-hidden rounded-2xl bg-ice shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-glow"
                  [attr.aria-label]="img.caption ?? img.alt ?? ''"
                  (click)="open(i)"
                >
                  <img
                    [src]="img.src"
                    [alt]="img.alt ?? img.caption ?? ''"
                    [appImageFallback]="fallbackImage()"
                    loading="lazy"
                    class="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </button>
                @if (img.caption) {
                  <p class="mt-2 text-center text-sm text-muted">{{ img.caption }}</p>
                }
              </li>
            }
          </ul>
        </div>
      </section>

      @if (selected() !== null) {
        <app-image-lightbox
          [images]="images()"
          [index]="selected()!"
          [fallbackImage]="fallbackImage()"
          [closeLabel]="content().closeLabel"
          [previousLabel]="content().previousLabel"
          [nextLabel]="content().nextLabel"
          (indexChange)="selected.set($event)"
          (closed)="selected.set(null)"
        />
      }
    }
  `,
})
export class GraduationGallery {
  readonly content = input.required<ResolvedInvitation['gallery']>();
  readonly fallbackImage = input.required<string>();

  protected readonly images = computed(() => this.content().images);
  protected readonly selected = signal<number | null>(null);

  protected open(index: number): void {
    this.selected.set(index);
  }
}
