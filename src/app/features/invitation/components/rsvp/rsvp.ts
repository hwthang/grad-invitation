import {
  Component,
  DestroyRef,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { RSVPStatus, ResolvedInvitation } from '../../../../core/models/invitation.model';
import { gsap, prefersReducedMotion } from '../../../../shared/animation';
import { AppButton } from '../../../../shared/components/button/button';
import { Fireworks } from '../../../../shared/components/fireworks/fireworks';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-rsvp',
  imports: [SectionHeading, AppButton, RevealDirective, Fireworks],
  host: { '(document:keydown.escape)': 'closeModal()' },
  template: `
    <app-fireworks #fireworks [autoplay]="false" [colors]="fireworkColors()" />

    <!-- Thank-you modal, centered in the viewport. Layers: backdrop 40 < fireworks 45 < card 50. -->
    @if (modalOpen(); as c) {
      <div data-backdrop aria-hidden="true" class="fixed inset-0 z-40 bg-navy/60 backdrop-blur-sm"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          data-modal
          role="dialog"
          aria-modal="true"
          aria-labelledby="rsvp-modal-title"
          class="pointer-events-auto w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-card ring-2 ring-sky/50"
        >
          <i class="fa-solid fa-circle-check mb-3 text-4xl text-royal" aria-hidden="true"></i>
          <h3 id="rsvp-modal-title" class="font-display text-2xl text-navy">{{ c.title }}</h3>
          <p class="mt-3 text-muted">{{ c.message }}</p>
          <div class="mt-6">
            <app-button [fullWidth]="true" (clicked)="closeModal()">{{ content().closeButton }}</app-button>
          </div>
        </div>
      </div>
    }

    <div appReveal>
      <div data-reveal>
        <app-section-heading [heading]="content().heading" icon="fa-regular fa-envelope-open" />
      </div>

      <div class="mt-8" aria-live="polite">
        @if (status() === 'PENDING') {
          <div data-reveal class="grid grid-cols-2 gap-3">
            <app-button [fullWidth]="true" (clicked)="respond('ATTENDING')">
              <i class="fa-regular fa-face-smile-beam" aria-hidden="true"></i>
              {{ content().attendingButton }}
            </app-button>
            <app-button variant="secondary" [fullWidth]="true" (clicked)="respond('NOT_ATTENDING')">
              <i class="fa-regular fa-face-sad-tear" aria-hidden="true"></i>
              {{ content().decliningButton }}
            </app-button>
          </div>
        } @else if (confirmation(); as c) {
          <div class="rounded-2xl bg-soft p-6 text-center">
            <i
              [class]="status() === 'ATTENDING' ? 'fa-solid fa-circle-check text-royal' : 'fa-solid fa-heart text-sky'"
              class="mb-2 text-3xl"
              aria-hidden="true"
            ></i>
            <h3 class="font-display text-xl text-navy">{{ c.title }}</h3>
            <p class="mt-2 text-muted">{{ c.message }}</p>
            <div class="mt-4">
              <app-button variant="secondary" (clicked)="respond('PENDING')">
                <i class="fa-solid fa-rotate-left" aria-hidden="true"></i>
                {{ content().changeButton }}
              </app-button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class Rsvp {
  readonly content = input.required<ResolvedInvitation['rsvp']>();
  readonly status = input.required<RSVPStatus>();
  readonly fireworkColors = input.required<readonly string[]>();
  readonly responded = output<RSVPStatus>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly fireworks = viewChild.required<Fireworks>('fireworks');

  private readonly modal = signal(false);

  protected readonly confirmation = computed(() => {
    const c = this.content();
    switch (this.status()) {
      case 'ATTENDING':
        return c.attendingConfirmation;
      case 'NOT_ATTENDING':
        return c.decliningConfirmation;
      default:
        return undefined;
    }
  });

  /** The attending message while the modal is open, otherwise false. */
  protected readonly modalOpen = computed(() =>
    this.modal() && this.status() === 'ATTENDING' ? this.content().attendingConfirmation : false,
  );

  constructor() {
    inject(DestroyRef).onDestroy(() => gsap.killTweensOf(this.host.querySelectorAll('[data-backdrop], [data-modal]')));

    // Fade/scale the modal in when it appears.
    afterRenderEffect(() => {
      if (!this.modalOpen() || prefersReducedMotion()) return;
      untracked(() => {
        const backdrop = this.host.querySelector('[data-backdrop]');
        const card = this.host.querySelector('[data-modal]');
        if (backdrop) gsap.from(backdrop, { opacity: 0, duration: 0.35, ease: 'power2.out' });
        if (card) gsap.from(card, { opacity: 0, scale: 0.9, y: 16, duration: 0.45, ease: 'back.out(1.5)', clearProps: 'all' });
      });
    });

    // Move focus into the modal so keyboard users land on it.
    afterRenderEffect(() => {
      if (!this.modalOpen()) return;
      untracked(() => this.host.querySelector<HTMLElement>('[data-modal] button')?.focus({ preventScroll: true }));
    });
  }

  protected respond(status: RSVPStatus): void {
    this.responded.emit(status);
    // Only an explicit "attending" click opens the modal, never a restored response.
    this.modal.set(status === 'ATTENDING');
    if (status === 'ATTENDING') this.fireworks().play();
  }

  protected closeModal(): void {
    this.modal.set(false);
  }
}
