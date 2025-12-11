import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchpage',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './searchpage.component.html',
  styleUrl: './searchpage.component.css'
})
export class SearchpageComponent {
  formGroup!: FormGroup;
  selectedFile!: File | null;
  loading = false;
  progress = 0;

  query: string = '';
  result: any = null;
  errorMessage: string = '';
  showJson: boolean = false;
  s3_upload_url: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.formGroup = this.fb.group({
      textInput: ['']
    });
  }

  // onFileSelect(event: any) {
  //   this.selectedFile = event.target.files[0];
  //   console.log("Selected File:", this.selectedFile);
  // }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;
    if (!file) return;

    console.log('file.name.........' + file.name);
    console.log('file.type.........' + file.type);

    // 1. Get pre-signed URL from your backend
    this.http.get(`http://localhost:8092/s3/get-presigned-url-ai-project?filename=${encodeURIComponent(file.name)}&filetype=${encodeURIComponent(file.type)}`)
      .subscribe((response: any) => {
        // response.url must be defined!

        console.log('response...........' + JSON.stringify(response));
        console.log('response.url.......' + response.url);

        this.s3_upload_url = response.url;

        const presignedUrl = response.url;
        if (!presignedUrl) {
          alert('Failed to get upload URL from backend.');
          return;
        }
        fetch(presignedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file
        })
          .then(resp => {
            if (resp.ok) {
              alert('Successfully Uploaded!');
            } else {
              alert('Upload failed!');
            }
          });
      });
  }

  onSubmitTemp() {
    // if (!this.selectedFile) {
    //   alert("Please upload a file!");
    //   return;
    // }

    this.loading = true;
    this.progress = 0;

    // Simulate File Upload Progress
    const interval = setInterval(() => {
      if (this.progress >= 100) {
        clearInterval(interval);
        this.loading = false;
        alert("Search Completed!");
      } else {
        this.progress += 10;
      }
    }, 300);
  }

  onSubmit() {
    if (!this.query.trim()) {
      this.errorMessage = "Please enter a search query";
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.result = null;
    this.showJson = false;

    const jsonContent = `{"search_content":"${this.query}",
    "s3_upload_url":"${this.s3_upload_url}"}`;

    console.log('Sending JSON content:', jsonContent);

    this.http.post<any>('http://localhost:8092/api/scrape', jsonContent)
      .subscribe({
        next: (data) => {
          this.result = data;

          console.log('Search results:', data);

          alert("Search Completed!");
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Failed to fetch search results';
          this.loading = false;
          console.error('Error:', error);
        }
      });
  }
}

