import { Injectable } from '@angular/core';
import { defaultInvitationFor } from '../config/default-invitation.config';
import { graduationInfo } from '../config/graduation-info.config';
import { themedAsset } from '../config/theme-assets.config';
import { GraduationInfo } from '../models/graduation-info.model';
import { Invitation, InvitationTheme, ResolvedInvitation } from '../models/invitation.model';
import { deepMerge } from '../utils/deep-merge';

export const DEFAULT_AVATAR = '/assets/images/default-guest.svg';

export interface ResolvedGuestInvitation {
  invitation: Invitation;
  /** Default content merged with the invitation's overrides. */
  content: ResolvedInvitation;
  /** The guest's avatar, or the themed placeholder. */
  avatar: string;
  theme: InvitationTheme;
  /** Shown when the avatar fails to load. */
  fallbackImage: string;
  info: GraduationInfo;
}

@Injectable({ providedIn: 'root' })
export class InvitationService {
  resolve(invitation: Invitation): ResolvedGuestInvitation {
    const theme = invitation.theme ?? 'blue';
    const fallbackImage = themedAsset(DEFAULT_AVATAR, theme);
    return {
      invitation,
      content: deepMerge(defaultInvitationFor(invitation.address), invitation.content ?? {}),
      avatar: invitation.avatar || fallbackImage,
      theme,
      fallbackImage,
      info: graduationInfo,
    };
  }
}
