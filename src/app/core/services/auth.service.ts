import { Injectable } from '@angular/core';

const SESSION_KEY = 'grad-console-auth';

/**
 * Front-end-only login gate. The credentials ship in the JS bundle, so this only hides the
 * console UI; it does not protect the API or the data.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private authed = this.readSession();

  get isLoggedIn(): boolean {
    return this.authed;
  }

  login(username: string, password: string): boolean {
    this.authed = username.trim() === 'admin' && password === 'Dht@2510';
    try {
      if (this.authed) sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // Session storage unavailable: the in-memory flag still works until reload.
    }
    return this.authed;
  }

  logout(): void {
    this.authed = false;
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
  }

  private readSession(): boolean {
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      return false;
    }
  }
}
