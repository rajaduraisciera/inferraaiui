import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';

type Tab = 'TEXT' | 'FILE';
// type FileType = 'INPUT' | 'RESULT';
type FileSource = 'LOCAL' | 'S3';

@Component({
  selector: 'app-modeselection',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './modeselection.component.html',
  styleUrl: './modeselection.component.css'
})

export class ModeselectionComponent {

  chatInput: any;
  selectedProcessorType: string = '';
  selectedSubProjectType: string = '';
  genericEnable: boolean = false;
  scadaaEnable: boolean = false;
  addressBasedInput: boolean = false;
  nonAddressBasedInput: boolean = false;
  selectedSource: string = '';
  selectedInputTypeNonAddress: string = '';
  inputTypeNonAddress: string[] = [];
  sourcenames: string[] = [];

  sendChat() {
    throw new Error('Method not implemented.');
  }

  activeTab: Tab = 'TEXT';
  fileType: String = '';
  fileSource: FileSource = 'LOCAL';

  inputText = '';
  selectedFile?: File;
  s3Path = '';
  result: any = null;
  tableKeys: string[] = [];
  tableData: any[] = [];
  searched_by: string = '';
  inputSearchTerm: string = '';
  input_filename: string = '';

  messages: {
    type: 'user' | 'bot';
    content: any;
    title?: any;
    detailurl?: any;
    isJson?: boolean;
  }[] = [];

  // private backendUrl = 'http://localhost:8080/api';
  private backendUrl = 'http://localhost:8092/api';

  constructor(private router: Router, private http: HttpClient) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { userName: string, email: string };

    if (state) {
      this.searched_by = state.userName;
      console.log('User Name:', state.userName);
      console.log('Email:', state.email);
      console.log('Searched By :', this.searched_by);
    }
  }

  switchTab(tab: Tab) {
    this.activeTab = tab;
    this.messages = [];
    this.http.post<any>(`${this.backendUrl}/reset`, {
      text: '',
    }).subscribe({
      next: () => {
        console.log('Backend variables reset successfully');
      },
      error: () => {
        console.error('Error while resetting backend variables');
      }
    });
  }

  // submitText() {
  //   console.log("enters into submitText function");
  //   if (!this.inputText?.trim()) return;

  //   // user message
  //   this.messages.push({
  //     type: 'user',
  //     content: this.inputText,
  //     isJson: false
  //   });

  //   // processing message
  //   const processingIndex = this.messages.length;
  //   this.messages.push({
  //     type: 'bot',
  //     content: 'Processing...',
  //     isJson: false
  //   });

  //   this.http.post<any>(`${this.backendUrl}/text`, {
  //     text: this.inputText
  //   }).subscribe({
  //     next: (res) => {
  //       this.prepareTable(res.data);
  //       this.messages[processingIndex] = {
  //         type: 'bot',
  //         content: res.data,
  //         title: res.title,
  //         detailurl: res.detailurl,
  //         isJson: true
  //       };
  //     },
  //     error: () => {
  //       this.messages[processingIndex] = {
  //         type: 'bot',
  //         content: '❌ Error while processing text',
  //         isJson: false
  //       };
  //     }
  //   });

  //   this.inputText = '';
  // }

  submitText() {
    console.log("enters into submitText function");
    if (!this.inputText?.trim()) return;




    this.onSubmitSearchInput();




    // user message
    this.messages.push({
      type: 'user',
      content: this.inputText,
      isJson: false
    });

    // processing message
    const processingIndex = this.messages.length;
    this.messages.push({
      type: 'bot',
      content: 'Processing...',
      isJson: false
    });

    this.http.post<any>(`${this.backendUrl}/text`, {
      text: this.inputText
    }).subscribe({
      next: (res) => {
        this.prepareTable(res.data);
        this.messages[processingIndex] = {
          type: 'bot',
          content: res.data,
          title: res.title,
          detailurl: res.detailurl,
          isJson: true
        };
      },
      error: () => {
        this.messages[processingIndex] = {
          type: 'bot',
          content: '❌ Error while processing text',
          isJson: false
        };
      }
    });

    this.inputText = '';
  }

  onSubmitSearchInput() {
    const timestamp = Date.now().toString() + Math.floor(Math.random() * 10000);
    console.log('timestamp....' + timestamp);

    const search_payload = `{"search_content":"${this.inputText}",
    "processor_type":"${this.selectedProcessorType}", 
    "sub_project":"${this.selectedSubProjectType}" ,
    "source_name":"${this.selectedSource}",
    "input_type_re":"${this.selectedInputTypeNonAddress}", 
    "file_type":"${this.fileType}",
    "search_type":"${this.activeTab}",
    "search_by":"${this.searched_by}",
    "search_term":"${this.inputSearchTerm}", 
    "input_filename":"${this.input_filename}",
    "unique_timestamp":"${timestamp}"}`;

    console.log('search_payload : ', search_payload);

    this.http.post<any>(`${this.backendUrl}/insertinputsearch`, search_payload)
      .subscribe({
        next: (data) => {
          console.log('input search returns : ', data);
          alert("Search Details Submitted!");
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
  }

  onFileSelected(e: any) {
    this.selectedFile = e.target.files[0];
  }

  //   prepareTable(data: any) {
  //     console.log("content...", data);
  //     if (typeof data === 'string') {
  //   data = JSON.parse(data);
  // }

  //   if (Array.isArray(data)) {
  //     this.tableData = data;
  //     console.log("Table Data:", this.tableData);
  //     this.tableKeys = Object.keys(data[0] || {});
  //   }

  //   // If response is single object
  //   else if (typeof data === 'object') {
  //     this.tableData = [data];   // convert to array
  //     this.tableKeys = Object.keys(data);
  //   }
  // }

  isObject(value: any): boolean {
    return value !== null && typeof value === 'object';
  }

  prepareTable(data: any) {

    console.log('Raw data:', data);

    // 1️⃣ If string → parse JSON
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error('Invalid JSON:', data);
        return;
      }
    }

    // 2️⃣ If wrapped inside "results"
    if (data && Array.isArray(data.results)) {

      this.tableData = data.results;

    }
    // 3️⃣ If direct array
    else if (Array.isArray(data)) {

      this.tableData = data;

    }
    // 4️⃣ If single object
    else if (typeof data === 'object') {

      this.tableData = [data];

    }
    else {
      console.error('Unsupported data format:', data);
      this.tableData = [];
    }

    // 5️⃣ Extract table headers
    if (this.tableData.length > 0) {
      this.tableKeys = Object.keys(this.tableData[0]);
    } else {
      this.tableKeys = [];
    }

    console.log('Final Table Data:', this.tableData);
    console.log('Table Keys:', this.tableKeys);
  }


  upload() {

    console.log("enters into upload function");

    if (!this.inputText?.trim()) return;

    // user message
    this.messages.push({
      type: 'user',
      content: this.inputText,
      isJson: false
    });

    // processing message
    const processingIndex = this.messages.length;
    this.messages.push({
      type: 'bot',
      content: 'Processing...',
      isJson: false
    });

    this.http.post<any>(`${this.backendUrl}/file`, {
      text: this.inputText,
      fileType: this.fileType
    }).subscribe({
      next: (res) => {
        // this.prepareTable(res.data);
        console.log("Response Data:", res.data);
        this.messages[processingIndex] = {
          type: 'bot',
          content: res,
          isJson: true
        };
      },
      error: () => {
        this.messages[processingIndex] = {
          type: 'bot',
          content: '❌ Error while processing text',
          isJson: false
        };
      }
    });
  }


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

        let s3_content = response.url.substring(0, response.url.indexOf("?"));
        let bucket_name = s3_content.substring(0, s3_content.indexOf("."));
        bucket_name = bucket_name.replaceAll("https://", "");
        let region_name = s3_content.substring(0, s3_content.indexOf(".amazonaws"));
        region_name = region_name.substring(region_name.lastIndexOf(".") + 1);
        let file_name = s3_content.substring(s3_content.lastIndexOf(".com/"));
        file_name = file_name.replace(".com", "");

        this.input_filename = bucket_name + file_name;

        console.log("s3_content+---------------" + s3_content);
        console.log("bucket_name+---------------" + bucket_name);
        console.log("region_name+---------------" + region_name);
        console.log("file_name+---------------" + file_name);
        console.log("final_s3path+---------------" + this.input_filename);

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

  reset() {

    this.inputText = '';
    this.selectedFile = undefined;
    this.s3Path = '';
    this.input_filename = '';
    this.result = null;
    this.inputSearchTerm = '';


    this.selectedProcessorType = '';
    this.selectedSubProjectType = '';
    this.genericEnable = false;
    this.scadaaEnable = false;
    this.addressBasedInput = false;
    this.nonAddressBasedInput = false;
    this.selectedSource = '';
    this.selectedInputTypeNonAddress = '';
    this.inputTypeNonAddress = [];
    this.sourcenames = [];


    this.http.post<any>(`${this.backendUrl}/reset`, {
      text: '',
    }).subscribe({
      next: () => {
        console.log('Backend variables reset successfully');
      },
      error: () => {
        console.error('Error while resetting backend variables');
      }
    });
  }

  resetSearch() {
    this.inputText = '';
    this.inputSearchTerm = '';

    console.log("Selected Search Type:", this.selectedProcessorType);

    if (this.selectedProcessorType === 'generic') {
      this.genericEnable = true;
      this.scadaaEnable = false;
    }
    else if (this.selectedProcessorType === 'scadaa') {
      this.scadaaEnable = true;
      this.genericEnable = false;
    }

    console.log("genericEnable:", this.genericEnable);
    console.log("scadaaEnable:", this.scadaaEnable);
  }

  searchCategoryForSubProject(event: any) {

    this.addressBasedInput = false;
    this.nonAddressBasedInput = false;
    this.selectedSource = '';
    this.selectedInputTypeNonAddress = '';
    this.inputTypeNonAddress = [];
    this.sourcenames = [];

    if (this.selectedSubProjectType === 'realestate') {
      this.addressBasedInput = false;
      this.nonAddressBasedInput = true;
    }
    else {
      this.addressBasedInput = true;
      this.nonAddressBasedInput = false;
    }

    console.log("selectedSubProjectType:", this.selectedSubProjectType);

    this.getSourceName();

  }

  getSourceName() {

    this.http.get(`${this.backendUrl}/getsourcenames/` + this.selectedSubProjectType).subscribe(
      (res: any) => {
        try {
          this.sourcenames = res;
          console.log('sourcenames....:', this.sourcenames);
        } catch (error) {
          console.error('Error at fetching source name :', error);
        }
      },
      (error) => {
        console.error('Error at fetching source name :', error);
      }
    );
  }

  searchBySourceName(event: any) {
    if (this.nonAddressBasedInput === true && this.selectedSource !== '') {
      this.inputTypeNonAddress = [];
      this.getInputTypeNonAddress();
    }
  }

  getInputTypeNonAddress() {

    this.http.get(`${this.backendUrl}/getinputtypes/` + this.selectedSource).subscribe(
      (res: any) => {
        try {
          this.inputTypeNonAddress = res;
          console.log('inputTypeNonAddress.... :', this.inputTypeNonAddress);
        } catch (error) {
          console.error('Error at fetching input type :', error);
        }
      },
      (error) => {
        console.error('Error at fetching input type :', error);
      }
    );
  }
}