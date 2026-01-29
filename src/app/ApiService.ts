
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  router = inject(Router);
 
  constructor(private http: HttpClient,
  ) {  }

  post(endPoint: string, params: any) {
    return this.http.post(environment.endpoint + endPoint, params);
  }
  get(endPoint: string) {
    return this.http.get(environment.endpoint + endPoint);
  }
  delete(endPoint: string) {
    return this.http.delete(environment.endpoint + endPoint);
  }

}