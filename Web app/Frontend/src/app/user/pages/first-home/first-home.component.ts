import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../api.service';
// import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-first-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './first-home.component.html',
  styleUrl: './first-home.component.scss'
})

export class FirstHomeComponent implements OnInit{
   value: any;
  constructor(private router: Router,private authService:ApiService,private route: ActivatedRoute) {}
  ngOnInit(): void {
    if(localStorage.getItem('login')?.length){
      this.value =1
    }else{
      this.value =0

    }
    // this.value = localStorage.getItem('login');
    console.log(  this.value);
  }

    menuOpen = false;
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    }

    generate(){
      console.log(this.value)
      if(this.value){
        this.router.navigate(['/generate']);
      }else{
        this.router.navigate(['/login']);
      }
      console.log(this.value);
    }
    isDarkMode = false; // Default to Dark Mode
    toggleMode() {
      this.isDarkMode = !this.isDarkMode;
      // Update the data-theme attribute on the document root
      document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
      console.log('Theme toggled to:', this.isDarkMode ? 'dark' : 'light'); // For debugging
    }

    detect(){
      if(this.value){
        this.router.navigate(['/detect']);
      }else{
        this.router.navigate(['/login']);
      }
    }

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
