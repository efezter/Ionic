import { Injectable } from '@angular/core';
import { HttpProvider } from './http/http';
import {RequestOptions} from '@angular/http';

@Injectable()
export class ShuttleData {

  constructor(
    public http: HttpProvider,
  ) {
  }

  getHostessShuttleInfo() {
      var requestoptions = new RequestOptions({
        params:{
        }
      })
      var response = this.http.get('Values/GetHostessShuttleInfo',requestoptions).map(res => res.json());
        return response;  
  }

  getStudShuttleInfo(_studentId:number) {
    var requestoptions = new RequestOptions({
      params:{
        studentId:_studentId
      }
    })
    var response = this.http.get('Values/getStudShuttleInfo',requestoptions).map(res => res.json());
      return response;  
}

}
