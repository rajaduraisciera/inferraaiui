import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

type Tab = 'TEXT' | 'FILE';
type FileType = 'INPUT' | 'RESULT';
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
  selectedSearchType: string = '';
  selectedSubProjectType: string = '';
  genericEnable: boolean = false;
  scadaaEnable: boolean = false;
  addressBasedInput: boolean = false;
  nonAddressBasedInput: boolean = false;
selectedSource: string = '';
selectedInputTypeNonAddress: string = '';
  inputTypeNonAddress: any;
  subProjectTypes: any;

  sendChat() {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.getSourceName();
    this.getInputTypeNonAddress();
  }

  activeTab: Tab = 'TEXT';
  fileType: FileType = 'INPUT';
  fileSource: FileSource = 'LOCAL';

  inputText = '';
  selectedFile?: File;
  s3Path = '';
  result: any = null;
  tableKeys: string[] = [];
  tableData: any[] = [];

  messages: {
    type: 'user' | 'bot';
    content: any;
    title?: any;
    detailurl?: any;
    isJson?: boolean;
  }[] = [];

  private backendUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

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

  submitText() {
    console.log("enters into submitText function");
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

  reset() {

    this.inputText = '';
    this.selectedFile = undefined;
    this.s3Path = '';
    this.result = null;

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

    console.log("Selected Search Type:", this.selectedSearchType);

    if (this.selectedSearchType === 'generic') {
      this.genericEnable = true;
      this.scadaaEnable = false;
    }
    else if (this.selectedSearchType === 'scadaa') {
      this.scadaaEnable = true;
      this.genericEnable = false;
    }

    console.log("genericEnable:", this.genericEnable);
    console.log("scadaaEnable:", this.scadaaEnable);
  }

  searchCategoryForSubProject(event: any) {
    if (this.selectedSubProjectType === 'realestate' || this.selectedSubProjectType === 'countysales' || this.selectedSubProjectType === 'propertyrecords' || this.selectedSubProjectType === 'apartment') {
      this.addressBasedInput = false;
      this.nonAddressBasedInput = true;
    }
    else if (this.selectedSubProjectType === 'ctelprocess' || this.selectedSubProjectType === 'promowatchprocess') {
      this.addressBasedInput = true;
      this.nonAddressBasedInput = false;
    }
  }

  getSourceName() {
    this.subProjectTypes = [
      'Realestate', 'CTEL'
    ];
  }

   getInputTypeNonAddress() {
    this.inputTypeNonAddress = [
      'Zipcode', 'County', 'City'
    ];
  }
}