import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {AuthService} from './auth/auth.service';
import {SubSink} from 'subsink';
import {MediaObserver} from '@angular/flex-layout';
import {combineLatest} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  styles: [
    `
      .app-container {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
      .app-is-mobile .app-toolbar {
        position: fixed;
        z-index: 2;
      }
      .app-sidenav-container {
        flex: 1;
      }
      .app-is-mobile .app-sidenav-container {
        flex: 1 0 auto;
      }
      mat-sidenav {
        width: 200px;
      }
      .image-cropper {
      width: 40px;
      height: 40px;
      position: relative;
      overflow: hidden;
      border-radius: 50%;
      margin-top: -8px;
    }
    `
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" fxLayoutGap="8px" *ngIf="{status: authService.authStatus$ | async,
        user: authService.currentUser$ | async} as auth;" class="app-toolbar" [class.app-is-mobile]="mediaObserver.isActive('xs')">
        <button mat-icon-button *ngIf="auth?.status?.isAuthenticated" (click)="sidenav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <a mat-button routerLink="/home">
          <mat-icon svgIcon="pitcher"></mat-icon>
          <span class="mat-h2">LemonMart</span>
        </a>
        <span class="flex-spacer"></span>
        <button mat-mini-fab routerLink="/user/profile" *ngIf="auth?.status?.isAuthenticated"
                matTooltip="Profile" aria-label="User Profile">
          <img *ngIf="auth?.user?.picture" class="image-cropper" [src]="auth?.user?.picture"/>
          <mat-icon *ngIf="!auth?.user?.picture">account_circle</mat-icon>
        </button>
        <button mat-mini-fab routerLink="/user/logout" *ngIf="auth?.status?.isAuthenticated"
                matTooltip="logout" aria-label="logout">
          <mat-icon>lock_open</mat-icon>
        </button>
      </mat-toolbar>
      <mat-sidenav-container class="app-sidenav-container">
        <mat-sidenav #sidenav [mode]="mediaObserver.isActive('xs') ? 'over' : 'side'"
        [fixedInViewport]="mediaObserver.isActive('xs')" fixedTopGap="56" [(opened)]="opened">
          <app-navigation-menu></app-navigation-menu>
        </mat-sidenav>
        <mat-sidenav-content>
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'lemon-mart-learn';
  private subs = new SubSink();
  opened = false;

  constructor(iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer,
              public authService: AuthService,
              public mediaObserver: MediaObserver,
  ) {
    iconRegistry.addSvgIcon('pitcher',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/pitcher.svg'));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.sink = combineLatest([this.mediaObserver.asObservable(), this.authService.authStatus$])
      .pipe(
        tap(([media, status]) => {
          if (!status?.isAuthenticated) {
            this.opened = false;
          } else {
            if (media[0].mqAlias === 'xs') {
              this.opened = false;
            } else {
              this.opened = true;
            }
          }
        })
      )
      .subscribe();
  }

}
