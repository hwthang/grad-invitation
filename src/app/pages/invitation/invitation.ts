import { Component, ElementRef, OnDestroy, afterNextRender, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { gsap } from 'gsap';
import { EVENT, findGuest } from '../../data/guests';

@Component({
  selector: 'app-invitation',
  imports: [RouterLink],
  templateUrl: './invitation.html',
})
export class Invitation implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private ctx?: gsap.Context;

  protected readonly event = EVENT;
  protected readonly inputName = toSignal(
    inject(ActivatedRoute).queryParamMap.pipe(map((p) => p.get('name') ?? '')),
    { initialValue: '' },
  );
  protected readonly guest = computed(() => findGuest(this.inputName()));

  constructor() {
    afterNextRender(() => {
      this.ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('.i-card', { y: 60, opacity: 0, scale: 0.9, duration: 0.9 })
          .from('.i-hero > *', { y: 24, opacity: 0, duration: 0.6, stagger: 0.15 }, '-=0.4')
          .from('.i-row', { x: -30, opacity: 0, duration: 0.5, stagger: 0.12 }, '-=0.2')
          .from('.i-msg', { opacity: 0, y: 16, duration: 0.6 }, '-=0.1')
          .from('.i-back', { opacity: 0, duration: 0.4 });

        gsap.to('.i-emoji', { rotate: 10, yoyo: true, repeat: -1, duration: 1.2, ease: 'sine.inOut' });
      }, this.host.nativeElement);
    });
  }

  ngOnDestroy() {
    this.ctx?.revert();
  }
}
