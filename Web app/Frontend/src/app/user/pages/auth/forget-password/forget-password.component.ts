import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../../api.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [RouterModule,  FormsModule,HttpClientModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  email: string = '';
  verificationCode: string = '';
  codeSent: boolean = false;

  constructor(private router: Router,private ser:ApiService,private authService: ApiService) {}

  // constructor(private authService: AuthService) {}

  sendResetCode() {
    // http://127.0.0.1:5000/forgot-password
    this.authService.sendResetCode(this.email).subscribe({
      next: (res) => {
        console.log('Verification code sent:', res);
        alert('Check your email for the code.');
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Failed to send verification code.');
      }
    });
    this.codeSent = true;
  }

  verifyCode() {
    this.authService.verifyResetCode(this.email, this.verificationCode).subscribe({
      next: (res) => {
        this.router.navigate(['/changepassword'], { state: { email: this.email } });
      },
      error: (err) => {
        console.error('Invalid code', err);
        alert('Invalid verification code');
      }
    });
  }

}
