export type RSVPStatus = 'PENDING' | 'ATTENDING' | 'NOT_ATTENDING';

export interface RSVPResponse {
  guestId: string;
  guestName: string;
  status: RSVPStatus;
  updatedAt: string;
}

export interface RSVPStorage {
  [guestId: string]: RSVPResponse;
}
