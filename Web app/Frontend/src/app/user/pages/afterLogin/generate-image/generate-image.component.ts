import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ApiService } from '../../../../api.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-generate-image',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './generate-image.component.html',
  styleUrl: './generate-image.component.scss'
})
export class GenerateImageComponent {

  promptText: string = '';
  generatedImage: SafeUrl | null = null;
  imageUrlString: string | null = null;
  isLoading: boolean = false;

  generatedImages: any[] = [];
  showAllImages: boolean = false;
  test=3;
  constructor(
    private imageGenerationService: ApiService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadFromLocalStorage();
  }

  generateImage() {
    if (!this.promptText.trim()) {
      alert('Please enter a description for the image.');
      return;
    }

    this.isLoading = true;
    this.generatedImage = null;
    this.imageUrlString = null;

    this.imageGenerationService.generateImage(this.promptText).subscribe(
      (imageBlob: Blob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        this.imageUrlString = imageUrl;
        this.generatedImage = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error generating image:', error);
        this.isLoading = false;
        alert('Failed to generate image. Please try again.');
      }
    );
  }

  downloadImage() {
    if (!this.imageUrlString) {
      console.error('No image URL found!');
      return;
    }

    const link = document.createElement('a');
    link.href = this.imageUrlString;
    link.download = 'generated-image.png';
    link.click();
  }

  downloadSpecificImage(item: any) {
    const link = document.createElement('a');
    link.href = item.image;
    link.download = `ai-generated-${item.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  viewFullImage(imageUrl: string, prompt: string) {
    window.open(imageUrl, '_blank');
  }

  toggleShowAll() {
    this.showAllImages = !this.showAllImages;
    if(this.showAllImages ){
      this.test=this.generatedImages.length

    }  else{
this.test=3
      }
  }

  // get displayedImages() {
  //   return this.showAllImages ? this.generatedImages : this.generatedImages.slice(0, 6);
  // }

  private loadFromLocalStorage() {
    this.imageGenerationService.getUserGeneratedImages().subscribe({
      next: (data) => {
        this.generatedImages = data;
      },
      error: (err) => {
        if (err.status === 404) {
          console.error('Endpoint not found. Check backend URL:', this.imageGenerationService['apiUrl'] + '/user-generated-images');
        }
      }
    });
  }


deleteFromHistory(index: number) {
  const imageId = this.generatedImages[index].image_id;

  this.imageGenerationService.deleteGeneratedImage(imageId).subscribe({
    next: (res) => {
      console.log(res.message);
      this.generatedImages.splice(index, 1); 
    },
    error: (err) => {
      console.error('Delete image error:', err);
      alert('Failed to delete image. Please try again.');
    }
  });
}
  clearHistory() {
    this.imageGenerationService.deleteAllGeneratedImages().subscribe({
      next: (res) => {
        console.log(res.message);
        this.generatedImages = [];
      },
      error: (err) => console.error('Delete all images error:', err)
    });
  }
}
