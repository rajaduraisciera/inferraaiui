import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  // list_of_urls = [{"title":"Java | Oracle","url":"https:\/\/www.java.com\/"},{"title":"Java Tutorial","url":"https:\/\/www.w3schools.com\/java\/"},{"title":"Oracle Java Technologies","url":"https:\/\/www.oracle.com\/java\/technologies\/"},{"title":"Java Tutorial","url":"https:\/\/www.geeksforgeeks.org\/java\/java\/"},{"title":"Device Not Supported","url":"https:\/\/www.java.com\/download\/"},{"title":"Java (programming language)","url":"https:\/\/en.wikipedia.org\/wiki\/Java_(programming_language)"},{"title":"Dev.java: The Destination for Java Developers","url":"https:\/\/dev.java\/"},{"title":"Online Java Compiler","url":"https:\/\/www.programiz.com\/java-programming\/online-compiler\/"},{"title":"Download Java","url":"https:\/\/www.java.com\/en\/download\/manual.jsp"},{"title":"Java Software","url":"https:\/\/www.oracle.com\/in\/java\/"}];
  list_of_urls: any;
  selectedRow: any;


  search_type: string = '';
  search_content: string = '';
  input_file_name: string = '';
  result_s3_file_name: string = '';
  searched_by: string = '';

  constructor(private router: Router, private fb: FormBuilder, private http: HttpClient) {
    this.formGroup = this.fb.group({
      textInput: ['']
    });

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { userName: string, email: string };

    if (state) {
      this.searched_by = state.userName;
      console.log('User Name:', state.userName);
      console.log('Email:', state.email);
      console.log('Searched By :', this.searched_by);
    }
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

  // onSubmit() {
  //   if (!this.query.trim()) {
  //     this.errorMessage = "Please enter a search query";
  //     return;
  //   }

  //   this.loading = true;
  //   this.errorMessage = '';
  //   this.result = null;
  //   this.showJson = false;

  //   const jsonContent = `{"search_content":"${this.query}",
  //   "s3_upload_url":"${this.s3_upload_url}"}`;

  //   console.log('Sending JSON content:', jsonContent);

  //   this.http.post<any>('http://localhost:8092/api/scrape', jsonContent)
  //     .subscribe({
  //       next: (data) => {
  //         this.result = data;

  //         console.log('Search results:', data);

  //         alert("Search Completed!");
  //         this.loading = false;
  //       },
  //       error: (error) => {
  //         this.errorMessage = error.error?.error || 'Failed to fetch search results';
  //         this.loading = false;
  //         console.error('Error:', error);
  //       }
  //     });
  // }

  onReset() {
    this.list_of_urls = [];
    this.result = null;
    this.query = '';
    this.selectedFile = null;
    this.s3_upload_url = '';
    this.loading = false;
  }


  onSubmit() {
    if (!this.query.trim()) {
      this.errorMessage = "Please enter a search query";
      return;
    }

    this.loading = true;

    this.http.get("http://localhost:8092/api/suggestions?query=" + this.query)
      .subscribe({
        next: (data) => {
          this.list_of_urls = data;

          console.log('Search results suggestions:', this.list_of_urls);

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


  onSubmitSearchInput() {
    this.loading = true;
    const search_payload = `{"search_type":"${this.search_type}",
    "search_content":"${this.search_content}",
    "input_file_name":"${this.input_file_name}" ,
    "result_s3_file_name":"${this.result_s3_file_name}",
    "searched_by":"${this.searched_by}"}`;

    this.http.post<any>('http://localhost:8092/api/insertinputsearch', search_payload)
      .subscribe({
        next: (data) => {
          console.log('input search returns : ', data);
          alert("Search Details Submitted!");
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          console.error('Error:', error);
        }
      });
  }

  onUrlSelect(row: any) {
    this.selectedRow = row;
    console.log('Selected URL:', row);
    this.loading = true;

    this.http.post<any>('http://localhost:8092/api/scrape', this.selectedRow)
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

