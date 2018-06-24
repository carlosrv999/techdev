import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth-guard.service';
import { LoginGuard } from './auth/login-guard.service';
import { HttpModule } from '@angular/http';
import { ParkingService } from './admin/parking/parking.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    AuthModule,
    AdminModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    LoginGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
