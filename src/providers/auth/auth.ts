import {RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpProvider } from '../http/http';
import {Injectable} from "@angular/core";
import { Observable} from "rxjs";


@Injectable()
export class AuthProvider {

    constructor(public http: HttpProvider) {

    }
    
    checkLogin():Promise<boolean> {

        let token = localStorage.getItem('auth_token');
        if (token) {
            return Promise.resolve(true);
        }
        else
        {
            return  Promise.resolve(false);
        }
    }

    login(values: any): Observable<any>  {

            var requestoptions = new RequestOptions();                
          
               let body = 'username=' + values.username + '&password=' +  values.password + "&grant_type=password";
      
            var response = this.http.post('oauth/token',body,requestoptions).map(response => {
            
                let resJSON = response.json();
                 if(response.status == 200 && resJSON.access_token){
                    localStorage.setItem('auth_token',resJSON.access_token);;
                    return response;
                 }
                 else
                 {
                     return response;
                 }
             });

             return response;
    }

    // logout() {        
       
    //     this.homeService.deleteUserPushInfo().subscribe(function () {
           
    //         localStorage.clear();
    //     });; 
    // }
}

