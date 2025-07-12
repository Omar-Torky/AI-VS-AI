import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ChartOptions, ChartType } from 'chart.js';
import { ApiService } from '../../../api.service';
// import { Label } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
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
      // //////////
       this.authService.getSystemStats().subscribe({
    next: (data) => {
      console.log(data)
      this.stats = data;
    },
    error: (err) => {
      console.error('Failed to load stats', err);
    }
  });
    }
 // البيانات
 barChartOptions: ChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    }
  }
};

// barChartLabels: Label[] = ['Users', 'Generated Images', 'Detected as AI'];
barChartType: ChartType = 'bar';
barChartData = [
  { data: [120, 350, 50], label: 'Statistics' }
];

stats = {
  total_generated_images: 0,
  total_detected_images: 0,
  total_users: 0
};
deleteAdmin(email: string) {
  console.log(email)
    this.authService.deleteAdmin(email).subscribe({
      next: (response) => {
        console.log('Admin deleted:', response);
        location.reload();
        // this.authService.getAlladmins().subscribe({
        //   next: (data) => {
        //     this.admins = data.Admins;
        //   },
        //   error: (err) => {
        //     console.error('Failed to reload admins', err);
        //   }
        // });
      },
      error: (err) => {
        console.error('Failed to delete admin', err);
      }
    });
  }

demoteToUser(email: string) {
      this.authService.demoteToUser(email).subscribe({
      next: (res) => {
        console.log(res);
        alert(res);
      },
      error: (err) => {
        console.error(err.error?.error || 'Demotion failed');
        // alert(err.error?.error || 'Demotion failed');
      }
    });
  }

}

