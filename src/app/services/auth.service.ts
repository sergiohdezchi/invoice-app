import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse } from '../models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenSubject = new BehaviorSubject<string | null>(this.getStoredToken());

  token$ = this.tokenSubject.asObservable();

  constructor() {
    if (this.hasValidToken()) {
      this.refreshToken();
    }
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  private getStoredToken(): string | null {
    const token = localStorage.getItem('auth_token');
    const expiry = localStorage.getItem('token_expiry');

    if (token && expiry && new Date(expiry) > new Date()) {
      return token;
    }

    return null;
  }

  hasValidToken(): boolean {
    return !!this.getStoredToken();
  }

  refreshToken(): Observable<AuthResponse> {
    const payload = {
      client_id: environment.clientId,
      api_key: environment.apiKey
    };

    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/token`, payload)
      .pipe(
        tap(response => this.storeToken(response))
      );
  }

  private storeToken(response: AuthResponse): void {
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + response.expires_in);

    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('token_expiry', expiryDate.toISOString());

    this.tokenSubject.next(response.token);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token_expiry');
    this.tokenSubject.next(null);
  }
}
