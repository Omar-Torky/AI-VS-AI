import {  Routes } from '@angular/router';
import { LoginComponent } from './user/pages/auth/login/login.component';
import { SignupComponent } from './user/pages/auth/signup/signup.component';
import { FirstHomeComponent } from './user/pages/first-home/first-home.component';
import { HeaderComponent } from './admin/layouts/header/header.component';
import { DashboardComponent } from './admin/pages/dashboard/dashboard.component';
import { UsersComponent } from './admin/pages/users/users.component';
import { AdminComponent } from './admin/pages/admin/admin.component';
import { VerifyCodeComponent } from './user/pages/auth/verify-code/verify-code.component';
import { GenerateImageComponent } from './user/pages/afterLogin/generate-image/generate-image.component';
import { ForgetPasswordComponent } from './user/pages/auth/forget-password/forget-password.component';
import { ChangePasswordComponent } from './user/pages/auth/change-password/change-password.component';
import { DetectImageComponent } from './user/pages/afterLogin/detect-image/detect-image.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'firsthome'  , component: FirstHomeComponent },
  { path: 'login'  , component: LoginComponent  },
  { path: 'signup' , component: SignupComponent },
  { path: 'verify', component: VerifyCodeComponent },
  { path: 'changepassword'  , component: ChangePasswordComponent },

  { path: 'generate'  , component: GenerateImageComponent },
  { path: 'detect'  , component: DetectImageComponent },
  { path: 'forget'  , component: ForgetPasswordComponent },


  // { path: 'about'  , component: AboutComponent },


  // { path: 'firsthome', component: FirstHomeComponent},
  // { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  // { path: 'signup', component: SignupComponent , canActivate: [authGuard]},
  // { path: 'verify', component: VerifyCodeComponent , canActivate: [authGuard] },
  // { path: 'changepassword', component: ChangePasswordComponent, canActivate: [authGuard] },
  // { path: 'generate', component: GenerateImageComponent, canActivate: [authGuard] },
  // { path: 'detect', component: DetectImageComponent, canActivate: [authGuard] },
  // { path: 'forget', component: ForgetPasswordComponent , canActivate: [authGuard]},
  { path: ""       , redirectTo: '/firsthome', pathMatch: 'full' },
//
  // ///////////////////////
  { path: 'admin',
    component: HeaderComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'admin', component: AdminComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]},
  // { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

