import { AuthComponent } from './auth.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from './login-guard.service';

const authRoutes: Routes = [
  { path: 'auth', canActivate: [LoginGuard], component: AuthComponent, children: [
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent }
  ] }
]

@NgModule({
  imports: [
    RouterModule.forChild(authRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule {

}
