import { Injectable } from '@angular/core';
import { HttpProvider } from './http/http';
import {RequestOptions} from '@angular/http';


@Injectable()
export class StudentData {

  constructor(
    public http: HttpProvider
  ) {}


  fetchStudents() {          
    var response = this.http.get('Values/GetStudents/').map(res => res.json());
    return response;
  }

  getSchools() {          
    var response = this.http.get('Values/GetSchools/').map(res => res.json());
    return response;
  }

  getActivities(_studentId:number,_skip:number) {          
    var requestoptions = new RequestOptions({
      params:{studentId : _studentId ,skip: _skip}
  });
    var response = this.http.get('Values/GetActivities',requestoptions).map(res => res.json());
    return response;
  }

  updateStudent(student:any) {          
  //   var requestoptions = new RequestOptions({
  //     params:{s:student}
  // });
    var response = this.http.post('Values/UpdateStudent/',JSON.stringify(student)).map(res => res.json());
    return response;
  }


  getStudentsLocation(_studentId:string) {     
    
    var requestoptions = new RequestOptions({
      params:{parentId:_studentId}
    })
    var response = this.http.get('Values/GetStudentsLocation',requestoptions).map(res => res.json());
      return response;  
    }
  
  
  insertActivity(_studentId:number,_isTaken:boolean, _latidute:number,_longtidute:number ) {   
    // int studentId, bool drop, float latidute, float longtidute

    var requestoptions = new RequestOptions({
      params:{studentId:_studentId,isTaken:_isTaken, latidute:_latidute,longtidute:_longtidute}
  });
  var response = this.http.get('Values/InsertActivity',requestoptions).map(res => res.json());
    return response;  
  }

}
