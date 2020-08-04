import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {IUser, User} from '../user/user/user';
import {Role} from './auth.enum';
import { Injectable } from '@angular/core';
import {catchError, filter, map, tap} from 'rxjs/operators';
import {flatMap} from 'tslint/lib/utils';
import {transformError} from '../common/common';
import * as decode from 'jwt-decode';
import {CacheService} from './cache.service';

export interface IAuthStatus {
  isAuthenticated: boolean;
  userRole: Role;
  userId: string;
}

export interface IServerAuthResponse {
  accessToken: string;
}

export const defaultAuthStatus: IAuthStatus = {
  isAuthenticated: false,
  userRole: Role.None,
  userId: '',
};

export interface IAuthService {
  readonly authStatus$: BehaviorSubject<IAuthStatus>;
  readonly currentUser$: BehaviorSubject<IUser>;
  login(email: string, password: string): Observable<void>;
  logout(clearToken?: boolean): void;
  getToken(): string;
}
@Injectable()
export abstract class AuthService extends CacheService implements IAuthService {
  readonly authStatus$ = new BehaviorSubject<IAuthStatus>(defaultAuthStatus);
  readonly currentUser$ = new BehaviorSubject<IUser>(new User());
  protected abstract authProvider(
    email: string,
    password: string
  ): Observable<IServerAuthResponse>;
  protected abstract transformJwtToken(token: unknown): IAuthStatus;
  protected abstract getCurrentUser(): Observable<User>;
  constructor() {
    super();
    if (this.hasExpiredToken()) {
      this.logout(true);
    } else {
      this.authStatus$.next(this.getAuthStatusFromToken());
    }
  }


  getToken(): string {
    return this.getItem('jwt') ?? '';
  }

  protected setToken(jwt: string): void {
    this.setItem('jwt', jwt);
  }

  protected clearToken(): void {
    this.removeItem('jwt');
  }

  login(email: string, password: string): Observable<void> {
    this.clearToken();
    const loginResponse$ = this.authProvider(email, password).pipe(
        map((value) => {
          this.setToken(value.accessToken);
          const token = decode(value.accessToken);
          return this.transformJwtToken(token);
        }),
        tap((status) => this.authStatus$.next(status)),
        filter(status => status.isAuthenticated),
        flatMap(() => this.getCurrentUser()),
        map(user => this.currentUser$.next(user)),
        catchError(transformError)
      );
    loginResponse$.subscribe({
      error: err => {
        this.logout();
        return throwError(err);
      }
    });
    return loginResponse$;
  }

  logout(clearToken?: boolean): void {
    if (clearToken) {
      this.clearToken();
    }
    setTimeout(() => this.authStatus$.next(defaultAuthStatus), 0);
  }

  protected hasExpiredToken(): boolean {
    const jwt = this.getToken();
    if (jwt) {
      const payload = decode(jwt) as any;
      return Date.now() >= payload.exp * 1000;
    }
    return true;
  }

  protected getAuthStatusFromToken(): IAuthStatus {
    return this.transformJwtToken(decode(this.getToken()));
  }
}
