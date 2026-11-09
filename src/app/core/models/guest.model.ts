import { InvitationContent } from './invitation.model';

export interface Guest {
  id: string;
  name: string;
  aliases?: string[];
  image?: string;
  relationship?: string;
  invitation?: InvitationContent;
}
