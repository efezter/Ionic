import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController,LoadingController,ToastController,Events } from 'ionic-angular';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';

import { TabsPage } from '../tabs-page/tabs-page';
import {GlobalValues} from '../../app/global-values';
// import { SchedulePage } from '../schedule/schedule';


@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: UserOptions = { username: 'hostes', password: '123456' };
  submitted = false;

  constructor(
    public navCtrl: NavController, 
    public userData: UserData,
    public events: Events,
    private readonly loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public globalValues:GlobalValues
  ) {
    this.login.username = 'veli1';
    this.login.password = '123456';
   }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      let loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Giriş yapılıyor.'
      });
  
      loading.present();

      this.userData
        .login(this.login)
        .subscribe(
          (isLoginSuccess) => {
     
              if(isLoginSuccess)
              {
                  // this.navCtrl.setRoot(SchedulePage);
                  this.fetchUserInfo();
              }
              loading.dismiss()
          },
          err => {          
            loading.dismiss();
            this.handleError(err)
          });
    }
  }

  fetchUserInfo() {
    this.submitted = true;

      let loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Giriş yapılıyor.'
      });
  
      loading.present();

      this.userData
        .fetchUserInfo()
        .subscribe(
          (res) => { 
              if(res)
              {
                this.globalValues.userInfo = JSON.parse(res._body);
                 if(this.globalValues.userInfo.role == 'HOSTESS')
                 {
                  this.events.publish('app:savelocation');
                 }
                 else
                 {
                   this.globalValues.initPushNotificaiton();
                 }

                this.navCtrl.setRoot(TabsPage);
              }
              loading.dismiss()
          },
          err => {            
            loading.dismiss();
            this.handleError(err)
          });
    
  }

  handleError(error: any) {
    
    let message: string;
    if (error['_body']) {
      var d = JSON.parse(error['_body']);
      message = d.error_description;
    }
    else {
      message = `Giriş başarısız: ${error.statusText}`;
    }

    const toast = this.toastCtrl.create({
      message,
      duration: 5000,
      position: 'bottom'
    });

    toast.present();
  }
}
