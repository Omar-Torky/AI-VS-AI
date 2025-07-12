import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { ApiService } from '../../../../api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule,ReactiveFormsModule,
      HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
e:any;
  constructor(private router: Router,private fb: FormBuilder,private ser:ApiService,private route: ActivatedRoute) {}
  loginForm!: FormGroup;
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      this.e=email;
      const name = params['name'];
      if (email && name) {
        console.log("مرحبًا", name, "بإيميل", email);
        localStorage.setItem('login',email );
        this.router.navigate(['/loginGoogle']);
      }
    });
    // this.route.queryParams.subscribe(params => {
    //   if (params['loggedin'] === '1') {
    //     localStorage.setItem('login', '1');
    //     // optionally reload if needed:
    //     // window.location.reload();
    //   }
    // });
  }


  login() {
    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.ser.login(loginData).subscribe({
      next: (res:any) => {
        console.log(res);
        this.ser.setUserData(res);
        localStorage.setItem('login', res.email);
        if(res.role=="user"){
  this.router.navigate(['/firsthome'], { state: { data: res } });
}else{
  this.router.navigate(['/admin'], { state: { data: res } });

}
      },
      error: (err) => {
        console.log(err.error.error);
const errorMsg=err.error?.error ;
alert(err.error?.error || 'login failed.');
  if (errorMsg === 'Email not verified.') {
    this.router.navigate(['/verify']);
  }
  // else {
  //   alert(errorMsg || 'Login failed.');
  // }
      }
    })
  }

  loginWithGoogle() {
    this.ser.loginWithGoogle();
    localStorage.setItem('login',this.e );

  }

}
