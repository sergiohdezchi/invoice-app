import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenSubject = new BehaviorSubject<string | null>(this.getStoredToken());
  private userSubject = new BehaviorSubject<User | null>(this.getStoredUser());

  token$ = this.tokenSubject.asObservable();
  user$ = this.userSubject.asObservable();

  constructor() {
    // No need to refresh token on init as we now require explicit login
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  private getStoredToken(): string | null {
    const token = localStorage.getItem('auth_token');
    const expiry = localStorage.getItem('token_expiry');

    if (token && expiry && new Date(parseInt(expiry)) > new Date()) {
      return token;
    }

    return null;
  }

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  }

  hasValidToken(): boolean {
    return !!this.getStoredToken();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => this.storeAuthData(response))
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, userData)
      .pipe(
        tap(response => this.storeAuthData(response))
      );
  }

  refreshToken(): Observable<any> {
    const token = this.getStoredToken();
    if (token) {
      // Return existing token if we have it
      return of({ token });
    } else {
      // In a real app, you'd implement a proper refresh token mechanism
      // Since we don't have refresh token endpoint in the requirements, just return null
      return of(null);
    }
  }

  private storeAuthData(response: AuthResponse): void {
    if (response.data) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('token_expiry', response.data.expires_at.toString());
      localStorage.setItem('user', JSON.stringify(response.data.user));

      this.tokenSubject.next(response.data.token);
      this.userSubject.next(response.data.user);
    }
  }

  logout(): Observable<any> {
    // Call logout API
    return this.http.delete(`${environment.apiUrl}/auth/logout`).pipe(
      tap(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token_expiry');
        localStorage.removeItem('user');
        this.tokenSubject.next(null);
        this.userSubject.next(null);
      })
    );
  }
  
  logoutLocally(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token_expiry');
    localStorage.removeItem('user');
    this.tokenSubject.next(null);
    this.userSubject.next(null);
  }
}
