import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import { combineLatest } from 'rxjs';
import {filter, tap} from 'rxjs/operators';

@Component({
  selector: 'app-manager',
  template: `
    <div fxLayout="column" fxLayoutAlign="center center">
      <span class="mat-display-2">Hello, Limoncu!</span>
      <button mat-raised-button color="primary" routerLink="/manager" (click)="login()">Login As Manager</button>
    </div>
  `,
  styles: [ `
    div[fxLayout] {margin-top: 32px;}
  `]
})
export class HomeComponent implements OnInit {
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
