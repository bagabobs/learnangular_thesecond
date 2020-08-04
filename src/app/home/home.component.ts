import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import { combineLatest } from 'rxjs';
import {filter, tap} from 'rxjs/operators';

@Component({
  selector: 'app-manager',
  template: `
    <div *ngIf="displayLogin">
      <app-login></app-login>
    </div>
    <div *ngIf="!displayLogin">
      <span class="mat-display-3">You get a lemon, you get a lemon, you get a lemon...</span>
    </div>
  `,
  styles: [ `
    div[fxLayout] {margin-top: 32px;}
  `]
})
export class HomeComponent implements OnInit {
  displayLogin = true;
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  login(): void {
    this.authService.login('manager@test.com', '123456');
    combineLatest([this.authService.authStatus$, this.authService.currentUser$])
      .pipe(
        filter(([authUser, user]) => authUser.isAuthenticated && user._id !== ''),
        tap(([authStatus, user]) => this.router.navigate(['/manager']))
      )
      .subscribe();
  }

}
