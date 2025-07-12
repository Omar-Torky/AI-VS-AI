import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../api.service';
import { error } from 'console';

@Component({
  selector: 'app-detect-image',
  standalone: true,
  imports: [ FormsModule],
  templateUrl: './detect-image.component.html',
  styleUrl: './detect-image.component.scss'
})
export class DetectImageComponent {
  isDragging = false;
  selectedImage: File | null = null;
  imagePreview = '';
  aiProbability :any;
  isAIGenerated = true;
  confidence :any;
  dialog: any;

  ngOnInit(): void {
    this.getDetectedImages();
  }
constructor(private route: ActivatedRoute,private ser:ApiService){
  this.route.queryParams.subscribe(params => {
    const email = params['email'];
    const name = params['name'];
    if (email && name) {
      localStorage.setItem('login',email );
    }

  });
}
onDragOver(event: DragEvent) {
  event.preventDefault();
  this.isDragging = true;
}

onDragLeave(event: DragEvent) {
  event.preventDefault();
  this.isDragging = false;
}

onDrop(event: DragEvent) {
  event.preventDefault();
  this.isDragging = false;
  if (event.dataTransfer?.files) {
    this.handleFile(event.dataTransfer.files[0]);
  }
}

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    this.handleFile(input.files[0]);
  }
}

handleFile(file: File) {
  if (!file.type.match('image.*')) {
    alert('Please upload an image file.');
    return;
  }

  this.selectedImage = file;
  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview = reader.result as string;
    this.analyzeImage();
  };
  reader.readAsDataURL(file);
}

removeImage() {
  this.selectedImage = null;
  this.imagePreview = '';
  this.aiProbability = 0;
  this.isAIGenerated = false;
  this.confidence = 0;
}

analyzeImage() {
  if (!this.selectedImage) return;
  this.ser.uploadImage(this.selectedImage).subscribe(
    {
      next: (response) => {
        this.aiProbability = response.predicted_class === 'Real' ? 100 - parseFloat(response.confidence) : parseFloat(response.confidence);
        this.isAIGenerated = response.predicted_class !== 'Real';
        this.confidence = parseFloat(response.confidence);
  this.getDetectedImages();
      },
      error:(error) => {
        console.error('Error analyzing image:', error);
        if (error.status === 401) {
          alert('Please log in first.');
        } else {
          alert('Failed to analyze image. Please try again.');
        }
      }
    }
  );
}
detectedImages: { image: string, detection_result: string }[] = [];

  getDetectedImages(): void {
    this.ser.getUserDetectedImages().subscribe({
        next: (data) => {
            this.detectedImages = data;
        },
        error: (err) => {
            if (err.status === 404) {
                console.error('Endpoint not found. Check backend URL:', this.ser['apiUrl'] + '/user-detection-images');
            }
        }
    });
}
deleteImage(item: any, index: number) {

    this.ser.deleteDetectionImage(item.image_id).subscribe({
      next: () => {
        this.detectedImages.splice(index, 1);
        alert('Image deleted successfully');
      },
      error: (err) => {
        console.error(err);
        alert('Failed to delete image: ' + (err.error?.error || 'Unknown error'));
      }
    });
  }

deleteAllImages() {
  this.ser.deleteAllDetectionImages().subscribe({
    next: () => {
      this.detectedImages = [];
      alert('All detection images deleted successfully');
    },
    error: (err) => {
      console.error(err);
      alert('Failed to delete all images: ' + (err.error?.error || 'Unknown error'));
    }
  });
}

download(item: any, index: number) {
  const base64Data = item.image;

  const link = document.createElement('a');

  const byteString = atob(base64Data.split(',')[1]);
  const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: mimeString });

  const url = window.URL.createObjectURL(blob);
  link.href = url;
  link.download = `detection-image-${item.image_id || index}.png`; // اسم الملف

  link.click();

  window.URL.revokeObjectURL(url);
}

}
