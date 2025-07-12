import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  userData: any;
    constructor(private router: Router,private authService:ApiService) {}

  admins: any[] = [];
  ngOnInit() {
    this.authService.getAlladmins().subscribe({
      next: (data) => {
        this.admins = data.Admins;
        console.log('Admins loaded:', this.admins);
      },
      error: (err) => {
        console.error('Failed to load admins', err);
        alert('Failed to load admins: ' + (err.error?.error || 'Unknown error'));
      }
    });
  }
deleteAdmin(email: string) {
  console.log(email)
    this.authService.deleteAdmin(email).subscribe({
      next: (response) => {
        console.log('Admin deleted:', response);
        this.authService.getAlladmins().subscribe({
          next: (data) => {
            this.admins = data.Admins;
          },
          error: (err) => {
            console.error('Failed to reload admins', err);
          }
        });
      },
      error: (err) => {
        console.error('Failed to delete admin', err);
      }
    });
  }
}
