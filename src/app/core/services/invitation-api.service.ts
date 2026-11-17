import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Address, Invitation, InvitationContent, InvitationTheme, RSVPStatus } from '../models/invitation.model';

export interface InvitationInput {
  name: string;
  theme: InvitationTheme;
  address: Address;
  avatar?: string;
  content: InvitationContent;
}

/** REST client for the data.json-backed API (see server/index.mjs). */
@Injectable({ providedIn: 'root' })
export class InvitationApi {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/invitations';

  list(): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(this.base);
  }

  get(key: string): Observable<Invitation> {
    return this.http.get<Invitation>(`${this.base}/${encodeURIComponent(key)}`);
  }

  create(key: string, input: Partial<InvitationInput> & { name: string }): Observable<Invitation> {
    return this.http.post<Invitation>(this.base, { key, theme: 'blue', address: 'ban', content: {}, ...input });
  }

  update(key: string, input: InvitationInput): Observable<Invitation> {
    return this.http.put<Invitation>(`${this.base}/${encodeURIComponent(key)}`, input);
  }

  remove(key: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${encodeURIComponent(key)}`);
  }

  respond(key: string, status: RSVPStatus): Observable<Invitation> {
    return this.http.post<Invitation>(`${this.base}/${encodeURIComponent(key)}/rsvp`, { status });
  }
}
