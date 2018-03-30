import { Injectable } from '@angular/core';
import { HttpProvider } from './http/http';
import {RequestOptions} from '@angular/http';


@Injectable()
export class HostessData {

  constructor(
    public http: HttpProvider,
  ) {}

  insertLocation( _latidute:number,_longtidute:number ) {   
    // int studentId, bool drop, float latidute, float longtidute

      var requestoptions = new RequestOptions({
        params:{latidute:_latidute , longtidute:_longtidute}
      })
      var response = this.http.get('Values/InsertLocation',requestoptions).map(res => res.json());
        return response;  
  }

}
