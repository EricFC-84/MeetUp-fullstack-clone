import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';


import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { ApiService } from './services/api.service';
import { UserService } from './services/user.service';
import { DataService } from './services/data.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { EventComponent } from './event/event.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ProfileComponent } from './profile/profile.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';


let AppRoutes: Routes = [
  {"path": "", "component": HomeComponent, "canActivate": [AuthGuard]},
  {"path": "login", "component": LoginComponent},
  {"path": "register", "component": RegisterComponent},
  {"path": ":organizer/event/:event", "component": EventComponent},
  // {"path": "members/:id", "component": ProfileComponent},

  {"path": "profile/:id", "component": ProfileComponent},
  {"path": "addEvent", "component": CreateEventComponent, "canActivate": [AuthGuard]},
  {"path": ":user/edit/:id", "component": EditProfileComponent, "canActivate": [AuthGuard]},


]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    EventComponent,
    SpinnerComponent,
    ProfileComponent,
    NavbarComponent,
    CreateEventComponent,
    EditProfileComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(AppRoutes, {useHash: true})
  ],
  providers: [ApiService, UserService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
