import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, filter, tap} from 'rxjs/operators';
import {combineLatest} from 'rxjs';
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
    private route: ActivatedRoute
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
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]]
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
        this.router.navigate([this.redirectUrl || '/manager']);
      })
    ).subscribe();
  }

}
