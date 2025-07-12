import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../api.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  value: any;
    constructor(private authService:ApiService) {}

  logout() {
    this.authService.logout().subscribe({
      next: (res) => {
        localStorage.removeItem('login');
        location.reload();        },
      error: (err) => {
        console.error('Logout failed', err);
      }
    });
  }
}
