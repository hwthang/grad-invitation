import {
  Component,
  ElementRef,
  afterNextRender,
  computed,
  input,
  output,
  viewChild,
} from '@angular/core';
import { GalleryImage } from '../../../core/models/invitation.model';
import { gsap, prefersReducedMotion } from '../../animation';
import { ImageFallbackDirective } from '../../directives/image-fallback.directive';

@Component({
  selector: 'app-image-lightbox',
  imports: [ImageFallbackDirective],
  host: {
    '(document:keydown.escape)': 'close()',
    '(document:keydown.arrowleft)': 'step(-1)',
    '(document:keydown.arrowright)': 'step(1)',
  },
  template: `
    <div
      #backdrop
      class="fixed inset-0 z-50 flex items-center justify-center bg-navy/90 p-4"
      role="dialog"
      aria-modal="true"
      (click)="close()"
    >
      <button
        #closeBtn
        type="button"
        class="absolute right-4 top-4 flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
        [attr.aria-label]="closeLabel()"
        (click)="close(); $event.stopPropagation()"
      >
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>

      @if (images().length > 1) {
        <button
          type="button"
          class="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30 sm:left-6"
          [attr.aria-label]="previousLabel()"
          (click)="step(-1); $event.stopPropagation()"
        >
          <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
        </button>
        <button
          type="button"
          class="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30 sm:right-6"
          [attr.aria-label]="nextLabel()"
          (click)="step(1); $event.stopPropagation()"
        >
          <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
        </button>
      }

      @if (current(); as img) {
        <figure #figure class="max-h-full max-w-4xl text-center" (click)="$event.stopPropagation()">
          <img
            [src]="img.src"
            [alt]="img.alt ?? img.caption ?? ''"
            [appImageFallback]="fallbackImage()"
            class="mx-auto max-h-[75vh] rounded-2xl object-contain"
          />
          @if (img.caption) {
            <figcaption class="mt-3 text-white/90">{{ img.caption }}</figcaption>
          }
        </figure>
      }
    </div>
  `,
})
export class ImageLightbox {
  readonly images = input.required<GalleryImage[]>();
  readonly index = input.required<number>();
  readonly fallbackImage = input.required<string>();
  readonly closeLabel = input.required<string>();
  readonly previousLabel = input.required<string>();
  readonly nextLabel = input.required<string>();

  readonly closed = output<void>();
  readonly indexChange = output<number>();

  private readonly backdrop = viewChild.required<ElementRef<HTMLElement>>('backdrop');
  private readonly closeBtn = viewChild.required<ElementRef<HTMLButtonElement>>('closeBtn');

  protected readonly current = computed(() => this.images()[this.index()]);

  constructor() {
    afterNextRender(() => {
      this.closeBtn().nativeElement.focus();
      if (!prefersReducedMotion()) {
        gsap.from(this.backdrop().nativeElement, { opacity: 0, duration: 0.25, ease: 'power2.out' });
      }
    });
  }

  protected step(delta: number): void {
    const count = this.images().length;
    if (count < 2) return;
    this.indexChange.emit((this.index() + delta + count) % count);
  }

  protected close(): void {
    const el = this.backdrop().nativeElement;
    if (prefersReducedMotion()) return this.closed.emit();
    gsap.to(el, { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => this.closed.emit() });
  }
}
