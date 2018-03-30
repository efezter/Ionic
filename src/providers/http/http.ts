import {Injectable} from '@angular/core';
import {Http, XHRBackend, RequestOptions, RequestOptionsArgs, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class HttpProvider extends Http {

  _url:string;
  constructor (backend: XHRBackend, options: RequestOptions) {
   
    let token = localStorage.getItem('auth_token'); // your custom token getter function here
    if(!token)
    {
      token = '1';
    }
    // AIzaSyDOPjgFt2dulOHvEzdNiWFBNX3mQ2qiDv4
    // options.headers.set('Authorization', `Bearer ${token}`);
    // options.headers.set('Accept', 'application/json' );
    // options.headers.set('Content-Type', 'application/x-www-form-urlencoded' ); //application/json
    
     super(backend, options); 
      // this._url = 'http://192.168.1.34:85/';  
  
 // this._url = "http://localhost:59822/"; 
   this._url = "http://app.bilicra.com:85/";
  }
  
  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response>{
// alert(this._url)
      url =  this._url + url;   
       let token = localStorage.getItem('auth_token');

      if (!options) {          
          options = {headers: new Headers({
            "Content-Type": "application/json", 
            "Accept": "application/json"
            })};
          if(token)
            options.headers.set('Authorization', `Bearer ${token}`);
      }

      if (!options.headers)
        options.headers = new Headers();
  
        
    // let headers = new Headers({
		// 	'Content-Type': 'application/x-www-form-urlencoded'
		// });
    // options.headers = headers;


     return super.post(url,body, options)
      .map((result: Response) => result)
      .catch((error: any) => {
        return Observable.throw(error);
    });
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {

  url =  this._url + url;

    let token = localStorage.getItem('auth_token');

    if (typeof url === 'string') { // meaning we have to add the token to the options, not in url
      if (!options) {     
        options = {headers: new Headers()};     
      }
      else
      {
          options.headers = new Headers({ 'Content-Type': 'application/json' });      
      }

      if(token)
          options.headers.set('Authorization', `Bearer ${token}`);
    } 
    return super.request(url, options).map((res: Response) => res)
    // .catch((error: any) => {
    //     // todo: log?
      
    //     // if (error.status == 500) {
           
    //     // } else if (error.status == 588) {
            
    //     // }
       
    //      throw Observable.throw(error);
    // });
        // );//.catch(this.catchAuthError(this));
  }


}