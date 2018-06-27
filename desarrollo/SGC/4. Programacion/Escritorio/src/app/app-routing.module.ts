import { CuposManagerComponent } from './cupos-manager/cupos-manager.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "app/login/login.component";
import { LoginGuard } from "app/servicios/login-guard.service";

const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', canActivate: [LoginGuard], component: LoginComponent },
  { path: 'cupos', component: CuposManagerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}