import { Injectable, inject } from '@angular/core';
import { defaultInvitation } from '../config/default-invitation.config';
import { graduationInfo } from '../config/graduation-info.config';
import { defaultGuest } from '../config/guests.config';
import { GraduationInfo } from '../models/graduation-info.model';
import { Guest, GuestTheme } from '../models/guest.model';
import { ResolvedInvitation } from '../models/invitation.model';
import { themedAsset } from '../config/theme-assets.config';
import { deepMerge } from '../utils/deep-merge';
import { GuestService } from './guest.service';

export interface ResolvedGuestInvitation {
  guest: Guest;
  content: ResolvedInvitation;
  /** Guest image, with fallbacks applied. */
  image: string;
  theme: GuestTheme;
  /** Graduate portrait, themed when it is a placeholder. */
  portrait: string;
  /** Image shown when another image fails to load. */
  fallbackImage: string;
  info: GraduationInfo;
}

@Injectable({ providedIn: 'root' })
export class InvitationService {
  private readonly guests = inject(GuestService);

  resolve(guestId: string | null | undefined): ResolvedGuestInvitation {
    const guest = this.guests.getById(guestId);
    const content = deepMerge(defaultInvitation, guest.invitation ?? {});
    const theme = guest.theme ?? 'blue';
    return {
      guest,
      content,
      image: themedAsset(this.resolveImage(guest, content), theme),
      theme,
      portrait: themedAsset(graduationInfo.portrait, theme),
      fallbackImage: themedAsset(defaultGuest.image ?? graduationInfo.portrait, theme),
      info: graduationInfo,
    };
  }

  /** guest image → hero image → default guest image → graduate portrait */
  private resolveImage(guest: Guest, content: ResolvedInvitation): string {
    return guest.image || content.hero.image || defaultGuest.image || graduationInfo.portrait;
  }
}
