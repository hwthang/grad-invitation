import { Component, ElementRef, OnDestroy, afterNextRender, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  selector: 'app-welcome',
  imports: [FormsModule],
  templateUrl: './welcome.html',
})
export class Welcome implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly router = inject(Router);
  private ctx?: gsap.Context;

  protected readonly name = signal('');

  constructor() {
    afterNextRender(() => {
      this.ctx = gsap.context(() => {
        // 2 khối animate độc lập, mỗi khối là 1 tween riêng (không lồng nhau)
        gsap.fromTo(
          '.w-greeting',
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', clearProps: 'all' },
        );
        gsap.fromTo(
          '.w-form-card',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: 'power3.out', clearProps: 'all' },
        );

        gsap.to('.w-orb', {
          y: 'random(-30, 30)',
          x: 'random(-30, 30)',
          duration: 'random(3, 5)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: 0.4,
        });
      }, this.host.nativeElement);
    });
  }

  protected submit() {
    const value = this.name().trim();
    if (!value) {
      gsap.fromTo('.w-input', { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.15)' });
      return;
    }
    gsap.to(['.w-greeting', '.w-form-card'], {
      opacity: 0,
      y: -30,
      scale: 0.96,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => this.router.navigate(['/invitation'], { queryParams: { name: value } }),
    });
  }

  ngOnDestroy() {
    this.ctx?.revert();
  }
}
