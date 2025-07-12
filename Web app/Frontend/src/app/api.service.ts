import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}
  // private apiUrl = 'http://127.0.0.1:5000';
  private apiUrl = 'http://localhost:5000';

  // uploadImage(file: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('image', file);
  //   return this.http.post(this.apiUrl+'/login', formData, { withCredentials: true });
  // }

  register(userData: any): Observable<any> {
    return this.http.post(this.apiUrl + '/register', userData);
  }

  login(userData: any){
    return this.http.post(this.apiUrl+'/login',userData ,{
      withCredentials: true
    });
  }

  verify(userData: any){
    return this.http.post(this.apiUrl+"/verify-code",userData)
  }
  verifyResetCode(email: string, reset_code: string): Observable<any> {
    return this.http.post(this.apiUrl+'/verify-reset-code', {email,reset_code});
  }
  resend(email: string) {
    return this.http.post(this.apiUrl + "/resend-verification-code", { email });
  }
  resetPassword(email: string, new_password: string) {
    return this.http.post(`${this.apiUrl}/reset-password`, { email, new_password });
  }
  uploadImage(image: File): Observable<any> {
      const formData = new FormData();
      formData.append('image', image);
      return this.http.post<any>(this.apiUrl+"/upload-image-local", formData,{
        withCredentials: true
      });
  }
  loginWithGoogle(): void {
    window.location.href = 'http://127.0.0.1:5000/auth/google';
  }

  sendResetCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  generateImage(description: string): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/generate-image`, { description }, {
      withCredentials: true,
      responseType: 'blob'
    });
  }

  // logout(): Observable<any> {
  //   return this.http.post(this.apiUrl+"/logout",{});
  // }
  logout(): Observable<any> {
    return this.http.post(this.apiUrl + "/logout", {}, {
      withCredentials: true
    });
  }

  getSystemStats(): Observable<any> {
    return this.http.get(this.apiUrl + '/system-stats', {
      withCredentials: true
    });
  }
  getAllUsers(): Observable<any> {
    return this.http.get(this.apiUrl + '/users', {
      withCredentials: true
    });
  }
  getAlladmins(): Observable<any> {
    return this.http.get(this.apiUrl + '/Admins', {
      withCredentials: true
    });
  }

  deleteAdmin(email: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-user-by-email`, {
      body: { email },
      withCredentials: true
    });
  }
demoteToUser(email: string) {
    return this.http.post(`${this.apiUrl}/admin/demote-to-user`,{
      body: { email },
      withCredentials: true
    });
  }


  getUserDetectedImages(): Observable<any> {
    const fullUrl = `${this.apiUrl}/user-detection-images`;
    console.log('Requesting URL:', fullUrl);

    return this.http.get(fullUrl, { withCredentials: true }).pipe(
        catchError(error => {
            console.error('HTTP Error:', error);
            return throwError(() => new Error('Failed to fetch detected images'));
        })
    );
}
  getUserGeneratedImages(): Observable<any> {
    const fullUrl = `${this.apiUrl}/user-generated-images`;
    console.log('Requesting URL:', fullUrl);
    return this.http.get(fullUrl, { withCredentials: true }).pipe(
        catchError(error => {
            console.error('HTTP Error:', error);
            return throwError(() => new Error('Failed to fetch detected images'));
        })
    );
}
// deleteImage(imageId: number): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/user-detection-images/${imageId}`, {
//       withCredentials: true
//     });
//   }
deleteAllDetectionImages(): Observable<any> {
  return this.http.delete(`${this.apiUrl}/delete-all-detection-images`, {
    withCredentials: true
  });
}

    deleteDetectionImage(imageId: number): Observable<any> {
    return this.http.request('delete', `${this.apiUrl}/delete-detection-image`, {
      body: { image_id: imageId },
      withCredentials: true
    });
  }
deleteGeneratedImage(imageId: number) {
  return this.http.delete<{ message: string }>(
    `${this.apiUrl}/delete-generation-image`,
    {
      body: { image_id: imageId },
      withCredentials: true,
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
  );
}


deleteAllGeneratedImages() {
  return this.http.delete<any>(`${this.apiUrl}/delete-all-generation-images`, { withCredentials: true})

}


  searchUserByEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/search-user`, { email }, { withCredentials: true });
  }
  promoteToAdmin(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/admin/promote-to-admin`,
      { email },
      { withCredentials: true }
    );
  }
  private userData: any;
setUserData(data: any) {
  this.userData = data;
}

getUserData() {
  return this.userData;
}
}
