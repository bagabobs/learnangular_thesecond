import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '../auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, filter, tap} from 'rxjs/operators';
import {combineLatest} from 'rxjs';
import {EmailValidation, PasswordValidation} from '../common/validations';
import {UiService} from '../common/ui.service';
import {Role} from '../auth/auth.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private subs = new SubSink();
  loginForm: FormGroup = new FormGroup({});
  loginError = '';
  redirectUrl = '';
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private uiService: UiService
  ) {
    this.subs.sink = route.paramMap.subscribe(
     params => (this.redirectUrl = params.get('redirectUrl') ?? '')
    );
  }

  ngOnInit(): void {
    this.authService.logout();
    this.buildLoginForm();
  }

  buildLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', EmailValidation],
      password: ['', PasswordValidation]
    });
  }

  async login(submittedForm: FormGroup): Promise<void> {
    this.authService.login(
      submittedForm.value.email,
      submittedForm.value.password
    ).pipe(
      catchError(err => (this.loginError = err))
    );
    this.subs.sink = combineLatest([
      this.authService.authStatus$,
      this.authService.currentUser$
    ]).pipe(
      filter(([authUser, user]) => authUser.isAuthenticated && user?._id !== ''),
      tap(([authUser, user]) => {
        this.uiService.showToast(`Welcome ${user.fullName}! Role: ${user.role}`);
        this.router.navigate([this.redirectUrl ||
        this.homeRoutePerRole(user.role as Role)]);
      })
    ).subscribe();
  }

  private homeRoutePerRole(role: Role): string {
    switch (role) {
      case Role.Cashier:
        return '/pos';
      case Role.Clerk:
        return '/inventory';
      case Role.Manager:
        return '/manager';
      default:
        return '/user/profile';
    }
  }

}
