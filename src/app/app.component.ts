import { Component } from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary" fxLayoutGap="8px">
      <button mat-icon-button><mat-icon>menu</mat-icon></button>
      <a mat-button routerLink="/home">
        <mat-icon svgIcon="pitcher"></mat-icon>
        <span class="mat-h2">LemonMart</span>
      </a>
      <span class="flex-spacer"></span>
      <button mat-mini-fab routerLink="/user/profile"
        matTooltip="Profile" aria-label="User Profile">
        <mat-icon>account_circle</mat-icon>
      </button>
      <button mat-mini-fab routerLink="/user/logout"
        matTooltip="logout" aria-label="logout">
        <mat-icon>lock_open</mat-icon>
      </button>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'lemon-mart-learn';

  constructor(iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon('pitcher',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/pitcher.svg'));
  }

}
