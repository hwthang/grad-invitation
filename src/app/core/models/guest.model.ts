import { InvitationContent } from './invitation.model';

/** Color theme of the invitation. Omitted means the default blue theme. */
export type GuestTheme = 'blue' | 'pink';

export interface Guest {
  id: string;
  name: string;
  aliases?: string[];
  image?: string;
  relationship?: string;
  theme?: GuestTheme;
  invitation?: InvitationContent;
}
