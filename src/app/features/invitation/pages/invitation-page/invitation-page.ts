import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { InvitationService } from '../../../../core/services/invitation.service';
import { Closing } from '../../components/closing/closing';
import { EventDetails } from '../../components/event-details/event-details';
import { GraduateProfile } from '../../components/graduate-profile/graduate-profile';
import { GraduationGallery } from '../../components/graduation-gallery/graduation-gallery';
import { Hero } from '../../components/hero/hero';
import { Rsvp } from '../../components/rsvp/rsvp';

@Component({
  selector: 'app-invitation-page',
  imports: [Hero, GraduateProfile, EventDetails, GraduationGallery, Rsvp, Closing],
  template: `
    @let r = resolved();
    <main [attr.data-theme]="r.theme">
      <app-hero [content]="r.content.hero" [image]="r.image" [imageAlt]="r.guest.name" />
      <app-graduate-profile [content]="r.content.profile" [info]="r.info" />
      <app-event-details [content]="r.content.event" [info]="r.info" />
      <app-graduation-gallery [content]="r.content.gallery" />
      <app-rsvp [content]="r.content.rsvp" [guestId]="r.guest.id" [guestName]="r.guest.name" />
      <app-closing [content]="r.content.closing" [graduateName]="r.info.graduateName" />
    </main>
  `,
})
export class InvitationPage {
  private readonly invitations = inject(InvitationService);

  private readonly guestId = toSignal(
    inject(ActivatedRoute).queryParamMap.pipe(map((p) => p.get('guest'))),
    { initialValue: null },
  );

  /** Re-resolved whenever the `guest` query param changes; invalid ids fall back to the default guest. */
  protected readonly resolved = computed(() => this.invitations.resolve(this.guestId()));
}
