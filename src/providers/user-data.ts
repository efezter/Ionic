import { Injectable } from '@angular/core';
import { HttpProvider } from './http/http';
import { Events,LoadingController } from 'ionic-angular';
import { Observable} from "rxjs";
import {RequestOptions,Headers} from '@angular/http';


@Injectable()
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(
    public events: Events,
    public http: HttpProvider,
    private readonly loadingCtrl: LoadingController,
  ) {}

  saveUserPushInfo(pushToken :string,isIos:boolean)
  {  
  
    var response ;
      try
      {
          var requestoptions = new RequestOptions({
              params:{pushToken:pushToken,isIOS:isIos}
          });
          response = this.http.get('Values/SaveUserPushInfo',requestoptions).map(res => {res.json()});
      }
      catch(err)
      {
         alert(err);
      }        
      return response;
  }


  deleteUserPushInfo()
  {  var response ;
      try
      {
          response = this.http.get('Values/DeleteUserPushInfo').map(res => {res.json()});
      }
      catch(err)
      {
         alert(err);
      }        
      return response;
  }

  hasFavorite(sessionName: string): boolean {
    
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName: string): void {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };


  login(values: any): Observable<any>  {

     var options; 
     options = {headers: new Headers({
      "Content-Type": 'application/x-www-form-urlencoded'
      })};
    
    //={headers: new Headers({
    //   'Content-Type': 'application/x-www-form-urlencoded'
    //   })};  

  
       let body = 'username=' + values.username + '&password=' +  values.password + "&grant_type=password";

    var response = this.http.post('oauth/token',body,options).map(response => {
  
        let resJSON = response.json();
         if(response.status == 200 && resJSON.access_token){
            localStorage.setItem('auth_token',resJSON.access_token);        
            this.events.publish('user:login');
            return response;
         }
         else
         {
             return response;
         }
     });

     return response;
}

fetchUserInfo(): Observable<any>  {
  var requestoptions = new RequestOptions(); 
  var response = this.http.get('Values/GetUserInfo',requestoptions).map(response => {  
      let resJSON = response.json();
       if(response.status == 200){     
          localStorage.setItem('userInfo',JSON.stringify(resJSON));
          return response;
       }
       else
       {
           return response;
       }
   });
   return response;
}

changePassword(model:any): Observable<any>  {
  var response = this.http.post('api/Accounts/ChangePassword',JSON.stringify(model)).map(response => {  
     
       if(response.status == 200){     
       
          return response;
       }
       else
       {
           return response;
       }
   });
   return response;
}



  logout(): void {

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Çıkış yapılıyor.'
    });
    loading.present();

    this
      .deleteUserPushInfo()
      .subscribe(
        (isLoginSuccess) => {  
    localStorage.clear();
    this.events.publish('user:logout');   
            loading.dismiss();
        },
        err => {            
          alert(err);
          loading.dismiss();
        });
    
  };


  hasLoggedIn(): Promise<boolean> {
    let promise: Promise<boolean> = new Promise(
      ( resolve: (res: boolean)=> void, reject: (res: boolean)=> void) => {
          const res: boolean = localStorage.getItem('auth_token') != null;
          resolve(res);
      }
  );
    return promise;
  };

}
