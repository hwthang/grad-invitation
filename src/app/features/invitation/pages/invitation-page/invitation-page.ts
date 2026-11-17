import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { FIREWORK_COLORS } from '../../../../core/config/theme-assets.config';
import { Invitation, RSVPStatus } from '../../../../core/models/invitation.model';
import { InvitationApi } from '../../../../core/services/invitation-api.service';
import { InvitationService } from '../../../../core/services/invitation.service';
import { Fireworks } from '../../../../shared/components/fireworks/fireworks';
import { Loading } from '../../../../shared/components/loading/loading';
import { Closing } from '../../components/closing/closing';
import { Details } from '../../components/details/details';
import { Envelope } from '../../components/envelope/envelope';
import { Hero } from '../../components/hero/hero';
import { Rsvp } from '../../components/rsvp/rsvp';

type LoadState = { status: 'loading' } | { status: 'missing' } | { status: 'ready'; invitation: Invitation };

/** Public, read-only invitation for one guest: /invitations/:key */
@Component({
  selector: 'app-invitation-page',
  imports: [Hero, Details, Rsvp, Closing, Fireworks, Envelope, Loading],
  template: `
    @let s = state();
    @switch (s.status) {
      @case ('loading') {
        <div class="flex min-h-screen items-center justify-center bg-soft"><app-loading /></div>
      }
      @case ('missing') {
        <main class="flex min-h-screen items-center justify-center bg-soft px-4">
          <div role="alert" class="max-w-sm rounded-3xl bg-white p-8 text-center shadow-card">
            <i class="fa-solid fa-envelope mb-3 text-3xl text-sky" aria-hidden="true"></i>
            <p class="text-muted">Không tìm thấy thiệp mời này. Vui lòng kiểm tra lại đường dẫn.</p>
          </div>
        </main>
      }
      @case ('ready') {
        @let r = resolve(s.invitation);
        <main [attr.data-theme]="r.theme" class="min-h-screen bg-offwhite">
          <app-envelope [guestName]="r.invitation.name" (opened)="reveal()" />

          @if (revealed()) {
            <app-fireworks [colors]="colors[r.theme]" />
            <app-hero [content]="r.content.hero" [image]="r.avatar" [imageAlt]="r.invitation.name" [fallbackImage]="r.fallbackImage" />
            <section class="bg-gradient-to-b from-soft to-ice px-4 py-16 sm:py-20">
              <div class="mx-auto grid max-w-5xl items-start gap-12 md:grid-cols-2 md:gap-10">
                <app-details [event]="r.content.event" [info]="r.info" />
                <div class="rounded-3xl bg-white p-6 shadow-card sm:p-8">
                  <app-rsvp
                    [content]="r.content.rsvp"
                    [status]="status()"
                    [fireworkColors]="colors[r.theme]"
                    (responded)="respond(r.invitation.key, $event)"
                  />
                  <div class="mt-8 border-t border-ice pt-8">
                    <app-closing [content]="r.content.closing" [graduateName]="r.info.graduateName" />
                  </div>
                </div>
              </div>
            </section>
          }
        </main>
      }
    }
  `,
})
export class InvitationPage {
  private readonly api = inject(InvitationApi);
  private readonly invitations = inject(InvitationService);

  protected readonly colors = FIREWORK_COLORS;
  protected readonly revealed = signal(false);
  private readonly localStatus = signal<RSVPStatus | null>(null);

  protected readonly state = toSignal(
    inject(ActivatedRoute).paramMap.pipe(
      map((p) => p.get('key') ?? ''),
      switchMap((key) =>
        this.api.get(key).pipe(
          map((invitation): LoadState => ({ status: 'ready', invitation })),
          catchError(() => of<LoadState>({ status: 'missing' })),
          startWith<LoadState>({ status: 'loading' }),
        ),
      ),
    ),
    { initialValue: { status: 'loading' } as LoadState },
  );

  protected readonly status = computed<RSVPStatus>(() => {
    const s = this.state();
    return this.localStatus() ?? (s.status === 'ready' ? s.invitation.rsvp.status : 'PENDING');
  });

  protected resolve(invitation: Invitation) {
    return this.invitations.resolve(invitation);
  }

  protected reveal(): void {
    this.revealed.set(true);
  }

  protected respond(key: string, status: RSVPStatus): void {
    const previous = this.localStatus();
    this.localStatus.set(status); // optimistic
    this.api.respond(key, status).subscribe({
      error: () => this.localStatus.set(previous), // roll back so the guest can retry
    });
  }
}
