import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private router: Router,private authService:ApiService) {}
  logout() {
    this.authService.logout().subscribe({
      next: (res) => {
        localStorage.removeItem('login');  // إزالة بيانات الدخول من localStorage
        this.router.navigate(['/firsthome']);  // إعادة توجيه المستخدم إلى صفحة تسجيل
      },
      error: (err) => {
        console.error('Logout failed', err);  // التعامل مع أي خطأ في عملية تسجيل الخروج
      }
    });
  }
}
