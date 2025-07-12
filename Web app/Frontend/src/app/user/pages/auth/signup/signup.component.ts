import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ApiService } from '../../../../api.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule,  FormsModule,
    HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  termsAccepted = false;

  constructor(private http: HttpClient, private router: Router,private ser:ApiService) {}
  registerUser() {
    if (!this.termsAccepted) {
      alert('You must agree to the terms.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    const userData = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.ser.register(userData).subscribe({
      next: (res) => {
        console.log(res);
        // alert('Account created successfully!');
        this.router.navigate(['/verify']);
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.error || 'Registration failed.');
      }
    });

  }
}
