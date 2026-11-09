import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { gsap, prefersReducedMotion } from '../animation';

/**
 * Staggered entrance for every descendant marked with `data-reveal`
 * (optional values: "up" (default), "left", "right", "scale").
 * Runs on scroll by default, or immediately with `[revealOnLoad]="true"`.
 * The GSAP context (tweens + ScrollTriggers) is reverted on destroy.
 */
@Directive({ selector: '[appReveal]' })
export class RevealDirective {
  readonly revealOnLoad = input(false);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private cleanup?: () => void;

  constructor() {
    afterNextRender(() => {
      if (prefersReducedMotion()) return;
      const items = Array.from(this.host.querySelectorAll<HTMLElement>('[data-reveal]'));
      if (!items.length) return;

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { duration: 0.8, ease: 'power3.out' },
          scrollTrigger: this.revealOnLoad()
            ? undefined
            : { trigger: this.host, start: 'top 80%', once: true },
        });
        items.forEach((el, i) => {
          const from = { opacity: 0, ...variant(el.dataset['reveal']) };
          tl.from(el, { ...from, clearProps: 'transform,opacity' }, i * 0.12);
        });
      }, this.host);

      this.cleanup = () => ctx.revert();
    });

    inject(DestroyRef).onDestroy(() => this.cleanup?.());
  }
}

function variant(name: string | undefined): gsap.TweenVars {
  switch (name) {
    case 'left':
      return { x: -32 };
    case 'right':
      return { x: 32 };
    case 'scale':
      return { scale: 0.9 };
    default:
      return { y: 28 };
  }
}
