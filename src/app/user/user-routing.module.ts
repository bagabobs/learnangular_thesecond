import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProfileComponent} from './profile/profile.component';
import {LogoutComponent} from './logout/logout.component';
import {AuthGuardService} from '../auth/auth-guard.service';


const routes: Routes = [
  {
    path: 'profile', component: ProfileComponent,
    canActivate: [AuthGuardService]
  },
  { path: 'logout', component: LogoutComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
