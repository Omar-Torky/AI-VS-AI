import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterModule,FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  users: any[] = [];
  searchTerm: string = '';
 constructor(private http: HttpClient,private authService:ApiService) {}
  //  constructor(private authService:ApiService){}

  ngOnInit(): void {

    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data.users;
        console.log(data)
        // console.log( this.users)
      },
      error: (err) => {
        console.error('Failed to load stats', err);
      }
    });
  }
  deleteAdmin(email: string) {
    console.log(email)
      this.authService.deleteAdmin(email).subscribe({
        next: (response) => {
          console.log('Admin deleted:', response);
          // this.authService.getAlladmins().subscribe({
          //   next: (data) => {
          //     this.admins = data.Admins;
          //   },
          //   error: (err) => {
          //     console.error('Failed to reload admins', err);
          //   }
          // });
          location.reload();    },
        error: (err) => {
          console.error('Failed to delete admin', err);
        }
      });
    }
   makeAdmin(email: string) {
    this.authService.promoteToAdmin(email).subscribe({
      next: (response) => {
        console.log("make admin is done"); // "User promoted to admin successfully!"
        // this.authService.getAllUsers().subscribe({
        //   next: (data) => {
        //     this.users = data.users;
        //   },
        //   error: (err) => {
        //     console.error('Failed to reload users', err);
        //   }
        // });
        location.reload();
      },
      error: (err) => {
        console.error('Failed to promote user to admin', err);
      }
    });
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe({
      next:(data) => {
        this.users = data;
      },
      error:(error) => {
        console.error('Error loading users:', error);
      }
    }
    );
  }
  searchUser() {
    if (!this.searchTerm.trim()) {
      this.loadUsers();
      return;
    }

    this.authService.searchUserByEmail(this.searchTerm).subscribe({

      next:(response) => {
        if (response.data) {
          this.users = [response.data];
        } else {
          this.users = [];
        }
      },
      error:(error) => {
        console.error('Error searching user:', error);
        this.users = [];
      }
    }
    );
  }
}
