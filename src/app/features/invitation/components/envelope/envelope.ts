import { Component, DestroyRef, ElementRef, afterNextRender, inject, input, output, signal, viewChild } from '@angular/core';
import { ScrollTrigger, gsap, prefersReducedMotion } from '../../../../shared/animation';

/**
 * Full-screen "open the invitation" intro. Tap the envelope: the seal pops, the flap opens, the
 * card slides up, then the overlay fades and `opened` fires so the page can reveal itself.
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
        <p data-env-text class="mb-8 text-center font-display text-2xl italic text-royal sm:text-3xl">
          Thiệp mời dành cho {{ guestName() }}
        </p>

        <button
          #btn
          type="button"
          class="relative block h-52 w-80 max-w-full cursor-pointer [perspective:900px] focus-visible:outline-offset-8 sm:h-60 sm:w-96"
          aria-label="Mở thiệp"
          (click)="open()"
        >
          <span class="absolute inset-0 rounded-2xl bg-pastel shadow-card"></span>
          <span
            data-env-card
            class="absolute inset-x-4 bottom-2 top-4 flex flex-col items-center justify-center rounded-xl bg-white text-center shadow-card"
          >
            <i class="fa-solid fa-graduation-cap mb-2 text-3xl text-royal" aria-hidden="true"></i>
            <span class="font-display text-xl text-navy">Lễ Tốt Nghiệp</span>
          </span>
          <span
            class="absolute inset-x-0 bottom-0 h-3/5 rounded-b-2xl bg-sky [clip-path:polygon(0_0,50%_55%,100%_0,100%_100%,0_100%)]"
          ></span>
          <span
            data-env-flap
            class="absolute inset-x-0 top-0 h-3/5 origin-top rounded-t-2xl bg-royal [clip-path:polygon(0_0,100%_0,50%_100%)]"
          ></span>
          <span
            data-env-seal
            class="absolute left-1/2 top-[52%] z-10 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-royal shadow-card"
          >
            <i class="fa-solid fa-heart" aria-hidden="true"></i>
          </span>
        </button>

        <p data-env-text class="mt-8 animate-pulse text-sm tracking-wide text-muted">Chạm để mở thiệp</p>
      </div>
    }
  `,
})
export class Envelope {
  readonly guestName = input.required<string>();
  /** Fires when the overlay starts fading out. */
  readonly opened = output<void>();

  protected readonly gone = signal(false);

  private readonly overlay = viewChild<ElementRef<HTMLElement>>('overlay');
  private readonly btn = viewChild<ElementRef<HTMLElement>>('btn');
  private busy = false;
  private tl?: gsap.core.Timeline;
  private float?: gsap.core.Tween;
  private previousOverflow = '';

  constructor() {
    afterNextRender(() => {
      this.previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const btn = this.btn()?.nativeElement;
      btn?.focus({ preventScroll: true });
      const el = this.overlay()?.nativeElement;
      if (prefersReducedMotion() || !el || !btn) return;
      gsap.from(el.querySelectorAll('[data-env-text]'), { opacity: 0, y: 16, duration: 0.8, stagger: 0.2, ease: 'power3.out' });
      gsap.from(btn, {
        opacity: 0,
        y: 30,
        scale: 0.92,
        duration: 0.9,
        ease: 'back.out(1.4)',
        onComplete: () => {
          if (this.busy) return;
          this.float = gsap.to(btn, { y: -8, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        },
      });
    });
    inject(DestroyRef).onDestroy(() => {
      this.tl?.kill();
      this.float?.kill();
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

    if (prefersReducedMotion()) {
      this.opened.emit();
      return finish();
    }

    const q = (sel: string) => el.querySelector(sel);
    const card = q('[data-env-card]');
    const flap = q('[data-env-flap]');
    const btn = this.btn()!.nativeElement;

    this.float?.kill();
    this.tl = gsap
      .timeline({ defaults: { ease: 'power2.inOut', force3D: true } })
      .to(el.querySelectorAll('[data-env-text]'), { opacity: 0, y: -8, duration: 0.4, ease: 'power1.out' }, 0)
      .to(q('[data-env-seal]'), { scale: 1.2, duration: 0.18, ease: 'power1.out' }, 0)
      .to(q('[data-env-seal]'), { scale: 0, opacity: 0, duration: 0.3, ease: 'back.in(2)' }, 0.18)
      .to(btn, { y: 0, duration: 0.4 }, 0)
      .to(flap, { rotationX: 180, duration: 0.85 }, 0.3)
      .set(flap, { zIndex: 0 }, 0.7)
      .to(card, { yPercent: -75, duration: 1, ease: 'power3.out' }, 0.75)
      .to(btn, { y: 70, opacity: 0, duration: 0.8 }, 1.0)
      .to(card, { scale: 1.12, duration: 0.9, ease: 'power2.out' }, 1.05)
      .add(() => this.opened.emit(), 1.55)
      .to(el, { opacity: 0, duration: 0.9, ease: 'power1.inOut', onComplete: finish }, 1.55);
  }
}
