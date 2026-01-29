import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { ApiService } from '../ApiService';

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

  constructor(private router: Router, private api: ApiService) {
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


    // const resultjson = '{"listings": [{"address": "795 Wigan Pier Drive,Henderson,NV 89002","price": "$675,000","listing_url": "https://www.coldwellbanker.com/nv/henderson/795-wigan-pier-dr/lid-P00800000H5SMAeQntOKdTCi2rIB28SBAFrCDstn"},{"address": "648 Sunrise Lake Place,Henderson,NV 89002","price": "$524,999","listing_url": "https://www.coldwellbanker.com/nv/henderson/648-sunrise-lake-pl/lid-P00800000H5PYTrGg0QgVKvzyMS0FfAg9PAm26ko"},{"address": "1548 Maria Crossing Avenue,Henderson,NV 89002","price": "$370,000","listing_url": "https://www.coldwellbanker.com/nv/henderson/1548-maria-crossing-ave/lid-P00800000H5P9OkEj4zymXfVptCwKIAxENAhnbNG"},{"address": "179 Sandhill Crane Avenue,Henderson,NV 89002","price": "$549,000","listing_url": "https://www.coldwellbanker.com/nv/henderson/179-sandhill-crane-ave/lid-P00800000H5MVztNMxMucTE3pTvH4T3uZaBWaI8B"},{"address": "492 Waterfall Cove Court,Henderson,NV 89002","price": "$329,000","listing_url": "https://www.coldwellbanker.com/nv/henderson/492-waterfall-cove-ct/lid-P00800000H5MVzbgPkZl361ZTsIaEe5CWVRhr7V1"},{"address": "820 Bergamont Drive,Henderson,NV 89002","price": "$364,900","listing_url": "https://www.coldwellbanker.com/nv/henderson/820-bergamont-dr/lid-P00800000H5Ijudqz8WHUYDTwq9RmIMAC0eJ5lFf"},{"address": "1008 Santa Helena Avenue,Henderson,NV 89002","price": "$895,000","listing_url": "https://www.coldwellbanker.com/nv/henderson/1008-santa-helena-ave/lid-P00800000H5FnbDBmBDvvp2hxves2pZ6B7CntVgR"},{"address": "845 Cypress Pines Way,Henderson,NV 89002","price": "$435,000","listing_url": "https://www.coldwellbanker.com/nv/henderson/845-cypress-pines-way/lid-P00800000H5CjFWrExg4Bi9HVTZyviBA92OhmL4P"},{"address": "984 Mackenzie Creek Avenue,Henderson,NV 89002","price": "$750,000","listing_url": "https://www.coldwellbanker.com/nv/henderson/984-mackenzie-creek-ave/lid-P00800000H5B3Y2jwcDfrv1mgZzdyQYDrqTWpLYO"},{"address": "626 Locust Grove Street,Henderson,NV 89015","price": "$500,000","listing_url": "https://www.coldwellbanker.com/nv/henderson/626-locust-grove-st--lot/lid-P00800000H5B3YTHNQPPDypWCzQgEA1Kbz6yjff0"},{"address": "1097 Paradise Resort Drive,Henderson,NV 89002","price": "$365,000","listing_url": "https://www.coldwellbanker.com/nv/henderson/1097-paradise-resort-dr/lid-P00800000H5B3XttT0p65EQXVmBIYW3s0n32eBUm"},{"address": "1128 Tomasian Court,Henderson,NV 89002","price": "$695,000","listing_url": "https://www.coldwellbanker.com/nv/henderson/1128-tomasian-ct/lid-P00800000H59gWrmkmmqQ4Z8PqPfhfc9RM29uTyx"},{"address": "805 Blue Springs Drive,Henderson,NV 89002","price": "$495,000","listing_url": "https://www.coldwellbanker.com/nv/henderson/805-blue-springs-dr/lid-P00800000H59fO5xvcAYvGbjzLeKPkdxFu518tQo"},{"address": "231 W Horizon Ridge Parkway 1315,Henderson,NV 89012","price": "$195,000","listing_url": "https://www.coldwellbanker.com/nv/henderson/231-w-horizon-ridge-pkwy-apt-1315/lid-P00800000H59fQo304hWqK1OIc4tM3x1eon72d0L"},{"address": "225 Autumn Court,Henderson,NV 89002","price": "$385,000","listing_url": "https://www.coldwellbanker.com/nv/henderson/225-autumn-ct/lid-P00800000H59OslVVh90vKEQHDol59MRItalmsNo"}]}';
    const resultjson = '{"units":[{"unit_number":"739","beds":"Studio","baths":"1","sqft":"513","rent":"$1,695","available":"Feb20"},{"unit_number":"239","beds":"Studio","baths":"1","sqft":"520","rent":"$1,535","available":"Apr21"},{"unit_number":"213","beds":"1","baths":"1","sqft":"820","rent":"$1,623","available":"AvailableNow"},{"unit_number":"613","beds":"1","baths":"1","sqft":"820","rent":"$1,823","available":"AvailableNow"},{"unit_number":"413","beds":"1","baths":"1","sqft":"820","rent":"$1,668","available":"Feb1"},{"unit_number":"236","beds":"1","baths":"1","sqft":"841","rent":"$1,688","available":"AvailableNow"},{"unit_number":"405","beds":"1","baths":"1","sqft":"841","rent":"$1,738","available":"AvailableNow"},{"unit_number":"505","beds":"1","baths":"1","sqft":"841","rent":"$1,778","available":"AvailableNow"},{"unit_number":"360","beds":"1","baths":"1","sqft":"744","rent":"$1,712","available":"AvailableNow"},{"unit_number":"226","beds":"1","baths":"1","sqft":"755","rent":"$1,777","available":"AvailableNow"},{"unit_number":"526","beds":"1","baths":"1","sqft":"753","rent":"$1,807","available":"AvailableNow"},{"unit_number":"306","beds":"1","baths":"1","sqft":"753","rent":"$1,742","available":"Apr7"},{"unit_number":"483","beds":"1","baths":"1","sqft":"729","rent":"$1,747","available":"AvailableNow"},{"unit_number":"740","beds":"1","baths":"1","sqft":"729","rent":"$1,787","available":"AvailableNow"},{"unit_number":"642","beds":"1","baths":"1","sqft":"729","rent":"$1,812","available":"Feb15"},{"unit_number":"651","beds":"1","baths":"1","sqft":"1,214","rent":"$2,261","available":"AvailableNow"},{"unit_number":"751","beds":"1","baths":"1","sqft":"1,214","rent":"$2,336","available":"AvailableNow"},{"unit_number":"372","beds":"1","baths":"1","sqft":"999","rent":"$1,763","available":"Feb1"},{"unit_number":"764","beds":"1","baths":"1","sqft":"765","rent":"$1,747","available":"Feb5"},{"unit_number":"169","beds":"1","baths":"1","sqft":"745","rent":"$1,747","available":"Feb7"},{"unit_number":"437","beds":"1","baths":"1","sqft":"761","rent":"$1,722","available":"Apr10"},{"unit_number":"457","beds":"1","baths":"1","sqft":"761","rent":"$1,702","available":"Apr17"},{"unit_number":"469","beds":"1","baths":"1","sqft":"761","rent":"$1,777","available":"Jun5"},{"unit_number":"355","beds":"1","baths":"1","sqft":"1,015","rent":"$1,823","available":"Mar19"},{"unit_number":"331","beds":"2","baths":"2","sqft":"1,099","rent":"$2,026","available":"AvailableNow"},{"unit_number":"615","beds":"2","baths":"2","sqft":"1,099","rent":"$2,296","available":"AvailableNow"},{"unit_number":"431","beds":"2","baths":"2","sqft":"1,099","rent":"$2,056","available":"Apr8"},{"unit_number":"523","beds":"2","baths":"2","sqft":"1,216","rent":"$2,221","available":"AvailableNow"},{"unit_number":"571","beds":"2","baths":"2","sqft":"1,216","rent":"$2,261","available":"AvailableNow"},{"unit_number":"556","beds":"2","baths":"2","sqft":"1,290","rent":"$2,251","available":"AvailableNow"}]}';


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

        this.reset();



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

    this.api.post(`api/insertinputsearch`, search_payload)
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

    this.api.post(`/api/file`, {
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
    this.api.get(`/s3/get-presigned-url-ai-project?filename=${encodeURIComponent(file.name)}&filetype=${encodeURIComponent(file.type)}`)
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

    this.api.post(`/api/reset`, {
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

    this.api.get(`/api/getsourcenames/` + this.selectedSubProjectType).subscribe(
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

    this.api.get(`/api/getinputtypes/` + this.selectedSource).subscribe(
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