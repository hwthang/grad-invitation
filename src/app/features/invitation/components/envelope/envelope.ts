import { Component, DestroyRef, ElementRef, afterNextRender, inject, output, signal, viewChild } from '@angular/core';
import { ScrollTrigger, gsap, prefersReducedMotion } from '../../../../shared/animation';

/**
 * Full-screen intro: one round letter button with a pulsing ring. Tap it and the screen fades
 * away to reveal the invitation; `opened` fires as the fade starts so the page mounts underneath.
 */
@Component({
  selector: 'app-envelope',
  template: `
    @if (!gone()) {
      <div
        #overlay
        role="dialog"
        aria-modal="true"
        aria-label="Mở thiệp"
        class="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-gradient-to-b from-pastel/70 via-ice to-soft px-4"
      >
        <button
          #btn
          type="button"
          class="relative flex size-24 cursor-pointer items-center justify-center rounded-full bg-royal text-4xl text-white shadow-card transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-offset-8"
          aria-label="Mở thiệp"
          (click)="open()"
        >
          <span aria-hidden="true" class="absolute -inset-1 rounded-full border-2 border-royal"></span>
          <span aria-hidden="true" class="absolute -inset-1 rounded-full border-2 border-sky motion-safe:animate-ping"></span>
          <i class="fa-solid fa-envelope" aria-hidden="true"></i>
        </button>

      </div>
    }
  `,
})
export class Envelope {
  /** Fires when the overlay starts fading out. */
  readonly opened = output<void>();

  protected readonly gone = signal(false);

  private readonly overlay = viewChild<ElementRef<HTMLElement>>('overlay');
  private readonly btn = viewChild<ElementRef<HTMLElement>>('btn');
  private busy = false;
  private tween?: gsap.core.Tween;
  private previousOverflow = '';

  constructor() {
    afterNextRender(() => {
      this.previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      this.btn()?.nativeElement.focus({ preventScroll: true });
    });
    inject(DestroyRef).onDestroy(() => {
      this.tween?.kill();
      document.body.style.overflow = this.previousOverflow;
    });
  }

  protected open(): void {
    const el = this.overlay()?.nativeElement;
    if (this.busy || !el) return;
    this.busy = true;

    const finish = () => {
      document.body.style.overflow = this.previousOverflow;
      this.gone.set(true);
      // Scroll positions were measured while scrolling was locked; measure again.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    this.opened.emit();
    if (prefersReducedMotion()) return finish();
    this.tween = gsap.to(el, { opacity: 0, duration: 1, ease: 'power1.inOut', onComplete: finish });
  }
}
