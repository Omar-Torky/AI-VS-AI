import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../../api.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [RouterModule,  FormsModule,HttpClientModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  email:any;
  constructor(private router: Router,private authService:ApiService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { email: string };
    this.email = state?.email || '';

    console.log( this.email)
  }
  newPassword = '';
  confirmPassword = '';

  get passwordStrength(): string {
    if (!this.newPassword) return '';
    if (this.newPassword.length < 8) return 'weak';
    // if (!/[A-Z]/.test(this.newPassword) return 'medium';
    if (!/[^A-Za-z0-9]/.test(this.newPassword)) return 'medium';
    return 'strong';
  }

  passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword && this.newPassword !== '';
  }

  formValid(): boolean {
    return this.newPassword !== '' &&
           this.passwordsMatch() &&
           this.newPassword.length >= 8;
  }

  changePassword() {
    if (!this.formValid()) return;
    const body = {
      email: this.email,
      new_password: this.newPassword
    };

    const email = history.state.email; // أو خزنيه في متغير
    this.authService.resetPassword(email, this.newPassword).subscribe({
    next: (res) => {
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error('Invalid code', err);
      alert('Invalid verification code');
    }
  });
  // res => {
      // التوجيه أو رسالة نجاح
    //   this.router.navigate(['/login']);
    // });
  }

}
