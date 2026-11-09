import {
  Component,
  DestroyRef,
  ElementRef,
  afterRenderEffect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GuestService } from '../../../../core/services/guest.service';
import { gsap, prefersReducedMotion } from '../../../../shared/animation';
import { AppButton } from '../../../../shared/components/button/button';
import { Loading } from '../../../../shared/components/loading/loading';
import { WelcomeContent } from '../../models/welcome-content.model';
import { WelcomeContentService } from '../../services/welcome-content.service';

const NOT_FOUND_DELAY_MS = 1800;

type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; content: WelcomeContent };

@Component({
  selector: 'app-welcome-page',
  imports: [ReactiveFormsModule, AppButton, Loading],
  templateUrl: './welcome-page.html',
})
export class WelcomePage {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly router = inject(Router);
  private readonly guests = inject(GuestService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly state = signal<LoadState>({ status: 'loading' });
  protected readonly nameControl = new FormControl('', { nonNullable: true });
  protected readonly form = new FormGroup({ name: this.nameControl });
  protected readonly showRequired = signal(false);
  protected readonly showNotFound = signal(false);

  private navigating = false;
  private animated = false;
  private ctx?: gsap.Context;

  constructor() {
    inject(WelcomeContentService)
      .getContent()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (content) => this.state.set({ status: 'ready', content }),
        error: () => this.state.set({ status: 'error' }),
      });

    this.nameControl.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.showRequired.set(false);
      this.showNotFound.set(false);
    });

    // Once the content is in the DOM: entrance animation + input focus.
    afterRenderEffect(() => {
      if (this.state().status !== 'ready' || this.animated) return;
      this.animated = true;
      this.host.querySelector<HTMLInputElement>('[data-name-input]')?.focus({ preventScroll: true });
      this.playEntrance();
    });

    this.destroyRef.onDestroy(() => this.ctx?.revert());
  }

  protected submit(): void {
    if (this.navigating) return;

    const entered = this.nameControl.value.trim().replace(/\s+/g, ' ');
    if (!entered) {
      this.showRequired.set(true);
      this.showNotFound.set(false);
      if (!prefersReducedMotion()) {
        const input = this.host.querySelector('[data-name-input]');
        if (input) {
          gsap.killTweensOf(input);
          gsap.fromTo(input, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.2)', clearProps: 'transform' });
        }
      }
      return;
    }

    this.navigating = true;
    const guest = this.guests.findByName(entered);
    if (guest) {
      this.open(guest.id);
      return;
    }

    // Unknown name: tell the visitor, then continue with the generic invitation.
    this.showNotFound.set(true);
    setTimeout(() => this.open(this.guests.getDefault().id), NOT_FOUND_DELAY_MS);
  }

  private open(guestId: string): void {
    void this.router.navigate(['/invitation'], { queryParams: { guest: guestId } });
  }

  private playEntrance(): void {
    if (prefersReducedMotion()) return;
    this.ctx = gsap.context(() => {
      const clearProps = 'transform,opacity';
      gsap.from('[data-bg]', { opacity: 0, scale: 0.9, duration: 1.4, stagger: 0.2, ease: 'power2.out', clearProps });
      gsap
        .timeline({ defaults: { ease: 'power3.out', duration: 0.8, clearProps } })
        .from('[data-hero-heading]', { opacity: 0, y: 20 })
        .from('[data-hero-subtitle]', { opacity: 0, y: 28 }, '-=0.5')
        .from('[data-form-item]', { opacity: 0, y: 24, stagger: 0.12 }, '-=0.4');
    }, this.host);
  }
}
