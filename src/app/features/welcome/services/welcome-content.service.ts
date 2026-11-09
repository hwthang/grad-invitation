import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { WelcomeContent } from '../models/welcome-content.model';

export const WELCOME_CONTENT_URL = 'assets/config/welcome-content.json';

@Injectable({ providedIn: 'root' })
export class WelcomeContentService {
  private readonly http = inject(HttpClient);

  /** Errors are surfaced to the caller, which owns the error state. */
  getContent(): Observable<WelcomeContent> {
    return this.http.get<WelcomeContent>(WELCOME_CONTENT_URL);
  }
}
