import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

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
  table_id: string = '';
  timestamp: string = '';
  loading: boolean = false;

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
    // this.http.post<any>(`${this.backendUrl}/reset`, {
    //   text: '',
    // }).subscribe({
    //   next: () => {
    //     console.log('Backend variables reset successfully');
    //   },
    //   error: () => {
    //     console.error('Error while resetting backend variables');
    //   }
    // });

    this.reset();
  }

  submitText() {
    console.log("enters into submitText function");
    if (!this.inputText?.trim()) return;

    this.onSubmitSearchInput();

    // this.http.post<any>(`${this.backendUrl}/text`, {
    //   text: this.inputText
    // }).subscribe({
    //   next: (res) => {
    //     this.prepareTable(res.data);
    //     this.messages[processingIndex] = {
    //       type: 'bot',
    //       content: res.data,
    //       title: res.title,
    //       detailurl: res.detailurl,
    //       isJson: true
    //     };
    //   },
    //   error: () => {
    //     this.messages[processingIndex] = {
    //       type: 'bot',
    //       content: '❌ Error while processing text',
    //       isJson: false
    //     };
    //   }
    // });
    // this.inputText = '';
  }

  onSubmitSearchInput() {
    this.timestamp = Date.now().toString() + Math.floor(Math.random() * 10000);
    console.log('timestamp....' + this.timestamp);

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
    "unique_timestamp":"${this.timestamp}"}`;

    console.log('search_payload : ', search_payload);

    this.http.post<any>(environment.endpoint + `/api/insertinputsearch`, search_payload)
      .subscribe({
        next: (data) => {
          this.table_id = data;
          console.log('input search returns : ', data);

          const result_payload = `{"agg_master_id":"${this.table_id}",
    "unique_timestamp":"${this.timestamp}"}`;
          console.log("table_id...." + this.table_id);
          console.log("result_payload : ", result_payload);

          alert("Search Details Submitted!");


      if (this.table_id) {
        this.loading = true;
        this.http.post<any>(environment.endpoint + `/api/processed`, result_payload, { 
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .subscribe({
                next: (data) => {
                  let resultjson_full = JSON.stringify(data);
                  // console.log('results json..........:', data);
                  this.loading = false;

                  // const resultjson_full = '{"id": 4,"unique_timestamp": "456789258669855","parser_s3_path": "s3://ctel/ai_poc/parserdata/2026/jan/2026-01-30/singleoutput/1_1_list_apartment_details1769758399893.txt","data": {"units": [{"bedrooms": 2,"unit_number": "104","address": "1006 W Main Street, Mesa AZ 85201","sqft": 850.0,"bathrooms": 2,"rent": 1299.0},{"bedrooms": 2,"unit_number": "106","address": "1006 W Main Street, Mesa AZ 85201","sqft": 850.0,"bathrooms": 2,"rent": 1149.0},{"bedrooms": 2,"unit_number": "118","address": "1006 W Main Street, Mesa AZ 85201","sqft": 850.0,"bathrooms": 2,"rent": 1299.0},{"bedrooms": 2,"unit_number": "119","address": "1006 W Main Street, Mesa AZ 85201","sqft": 850.0,"bathrooms": 2,"rent": 999.0},{"bedrooms": 1,"unit_number": "126","address": "1006 W Main Street, Mesa AZ 85201","sqft": 680.0,"bathrooms": 1,"rent": 1059.0},{"bedrooms": 2,"unit_number": "303","address": "1006 W Main Street, Mesa AZ 85201","sqft": 850.0,"bathrooms": 2,"rent": 1199.0},{"bedrooms": 2,"unit_number": "305","address": "1006 W Main Street, Mesa AZ 85201","sqft": 850.0,"bathrooms": 2,"rent": 999.0},{"bedrooms": 2,"unit_number": "314","address": "1006 W Main Street, Mesa AZ 85201","sqft": 850.0,"bathrooms": 2,"rent": 1299.0},{"bedrooms": 2,"unit_number": "315","address": "1006 W Main Street, Mesa AZ 85201","sqft": 850.0,"bathrooms": 2,"rent": 999.0}]}}';

                  // Parse and extract the 'data' property
                  const parsedJson = JSON.parse(resultjson_full);
                  const dataContent = parsedJson.data;
                  console.log('Extracted data:', dataContent);

                  const resultjson = JSON.stringify(dataContent);

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

                  this.prepareTable(resultjson);
                  this.messages[processingIndex] = {
                    type: 'bot',
                    content: resultjson,
                    // title: res.title,
                    // detailurl: res.detailurl,
                    isJson: true
                  };

                  // this.reset();

                },
                error: (error) => {
                  console.error('Error:', error);
                  this.loading = false;
                }
              });
          }

        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
  }

  onFileSelected(e: any) {
    this.selectedFile = e.target.files[0];
  }


  isObject(value: any): boolean {
    return value !== null && typeof value === 'object';
  }

  prepareTable(data: any) {
    console.log('Raw data:', data);

    // Parse JSON string if needed
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error('Invalid JSON string:', data);
        this.tableData = [];
        this.tableKeys = [];
        return;
      }
    }

    // Handle different data structures
    let extractedData: any[] = [];

    if (data && typeof data === 'object') {
      // Check if data has a nested array property (like 'results', 'units', 'listings', etc.)
      const nestedArrayKey = Object.keys(data).find(key => Array.isArray(data[key]));

      if (nestedArrayKey && data[nestedArrayKey].length > 0) {
        // Extract nested array (e.g., data.results, data.units, data.listings)
        extractedData = data[nestedArrayKey];
      }
      else if (Array.isArray(data)) {
        // Direct array
        extractedData = data;
      }
      else {
        // Single object - convert to array for consistent handling
        extractedData = [data];
      }
    }
    else {
      console.error('Unsupported data format:', data);
      this.tableData = [];
      this.tableKeys = [];
      return;
    }

    // Set table data
    this.tableData = extractedData;

    // Dynamically extract all unique keys from all objects (in case keys vary)
    if (this.tableData.length > 0) {
      const allKeys = new Set<string>();
      this.tableData.forEach(row => {
        if (row && typeof row === 'object') {
          Object.keys(row).forEach(key => allKeys.add(key));
        }
      });
      this.tableKeys = Array.from(allKeys);
    } else {
      this.tableKeys = [];
    }

    console.log('Final Table Data:', this.tableData);
    console.log('Dynamic Table Keys (Headers):', this.tableKeys);
    console.log(`Prepared ${this.tableData.length} rows with ${this.tableKeys.length} columns`);
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

    this.http.post<any>(environment.endpoint + `/api/file`, {
      text: this.inputText,
      fileType: this.fileType
    }).subscribe({
      next: (res) => {
        // this.prepareTable(res.data);
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
    this.http.get(environment.endpoint + `/s3/get-presigned-url-ai-project?filename=${encodeURIComponent(file.name)}&filetype=${encodeURIComponent(file.type)}`)
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
    this.fileType = '';
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
    this.timestamp = '';
    this.table_id = '';
    this.tableKeys = [];
    this.tableData = [];
    this.messages = [];

    // this.http.post<any>(environment.endpoint + `/api/reset`, {
    //   text: '',
    // }).subscribe({
    //   next: () => {
    //     console.log('Backend variables reset successfully');
    //   },
    //   error: () => {
    //     console.error('Error while resetting backend variables');
    //   }
    // });
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

    this.http.get(environment.endpoint + `/api/getsourcenames/` + this.selectedSubProjectType).subscribe(
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

    this.http.get(environment.endpoint + `/api/getinputtypes/` + this.selectedSource).subscribe(
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