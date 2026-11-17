import {
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
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

const SPOTLIGHT_MS = 6000;

@Component({
  selector: 'app-rsvp',
  imports: [SectionHeading, AppButton, RevealDirective, Fireworks],
  host: { '(document:keydown.escape)': 'dismissSpotlight()' },
  template: `
    <app-fireworks #fireworks [autoplay]="false" [colors]="fireworkColors()" />

    <!-- Dark blur behind the thank-you card; click, Esc or a short timeout dismisses it. -->
    @if (spotlight()) {
      <div
        data-backdrop
        aria-hidden="true"
        class="fixed inset-0 z-40 bg-navy/60 backdrop-blur-sm"
        (click)="dismissSpotlight()"
      ></div>
    }

    <div appReveal>
      <div>
        <div data-reveal>
          <app-section-heading [heading]="content().heading" icon="fa-regular fa-envelope-open" />
        </div>

        <div class="mt-8" aria-live="polite">
          @switch (status()) {
            @case ('PENDING') {
              <div data-reveal class="grid grid-cols-2 gap-3">
                <app-button [fullWidth]="true" (clicked)="respond('ATTENDING')">
                  <i class="fa-regular fa-face-smile-beam" aria-hidden="true"></i>
                  {{ content().attendingButton }}
                </app-button>
                <app-button variant="secondary" [fullWidth]="true" (clicked)="respond('NOT_ATTENDING')">
                  <i class="fa-regular fa-face-smile" aria-hidden="true"></i>
                  {{ content().decliningButton }}
                </app-button>
              </div>
            }

            @default {
              @if (confirmation(); as c) {
                <div
                  data-confirm
                  class="rounded-2xl bg-soft p-6 text-center"
                  [class.relative]="spotlight()"
                  [class.z-50]="spotlight()"
                  [class.shadow-glow]="spotlight()"
                >
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
            }
          }
        </div>
      </div>
    </div>
  `,
})
export class Rsvp {
  readonly content = input.required<ResolvedInvitation['rsvp']>();
  readonly status = input.required<RSVPStatus>();
  readonly responded = output<RSVPStatus>();
  readonly fireworkColors = input.required<readonly string[]>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly injector = inject(Injector);
  private readonly fireworks = viewChild.required<Fireworks>('fireworks');
  private spotlightTimer?: ReturnType<typeof setTimeout>;

  /** True while the dark blur is shown after the visitor confirms attendance. */
  protected readonly spotlight = signal(false);

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

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.spotlightTimer));

    // Fade the dark blur in when it appears.
    afterRenderEffect(() => {
      if (!this.spotlight() || prefersReducedMotion()) return;
      untracked(() => {
        const el = this.host.querySelector('[data-backdrop]');
        if (el) gsap.from(el, { opacity: 0, duration: 0.4, ease: 'power2.out' });
      });
    });

    // Scale/fade the confirmation card in whenever a response is recorded.
    afterRenderEffect(() => {
      if (this.status() === 'PENDING' || prefersReducedMotion()) return;
      untracked(() => {
        const el = this.host.querySelector('[data-confirm]');
        if (el) gsap.from(el, { opacity: 0, scale: 0.92, duration: 0.5, ease: 'back.out(1.6)', clearProps: 'all' });
      });
    });
  }

  protected respond(status: RSVPStatus): void {
    this.responded.emit(status);
    if (status === 'ATTENDING') this.celebrate();
    else this.dismissSpotlight(false);
  }

  /** Only runs on an explicit "attending" click, never when a saved response is restored. */
  private celebrate(): void {
    this.spotlight.set(true);
    this.fireworks().play();
    clearTimeout(this.spotlightTimer);
    this.spotlightTimer = setTimeout(() => this.dismissSpotlight(), SPOTLIGHT_MS);

    afterNextRender(
      () =>
        this.host
          .querySelector('[data-confirm]')
          ?.scrollIntoView({ block: 'center', behavior: prefersReducedMotion() ? 'auto' : 'smooth' }),
      { injector: this.injector },
    );
  }

  protected dismissSpotlight(animate = true): void {
    clearTimeout(this.spotlightTimer);
    const el = this.host.querySelector('[data-backdrop]');
    if (!this.spotlight()) return;
    if (!animate || !el || prefersReducedMotion()) return this.spotlight.set(false);
    gsap.to(el, { opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: () => this.spotlight.set(false) });
  }
}
