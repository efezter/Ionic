import { Component } from '@angular/core';

import { AlertController, NavController,LoadingController,ToastController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';
import { GlobalValues } from '../../app/global-values';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  username: string;
passwordModel:any;
  constructor(public globalValues:GlobalValues ,public toastCtrl: ToastController,public alertCtrl: AlertController, public nav: NavController, public userData: UserData,private readonly loadingCtrl: LoadingController,) {
    // this.passwordModel = {
    //   OldPassword:"123456",
    //   NewPassword:"111111",
    //   ConfirmPassword:"111111"
    // };
    
    this.globalValues.getUserInfo();
    this.username = this.globalValues.userInfo.userName;
  }

  ngAfterViewInit() {
   
    this.getUsername();
  }

  updatePicture() {
    console.log('Clicked to update picture');
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  changeUsername() {
  
  }

  getUsername() {
     
    // this.userData.getUsername().then((username) => {
    //   this.username = username;
    // });
  }

  changePassword() {
    let alert = this.alertCtrl.create({
      title: 'Şifre Değiştir',
      buttons: [
        'Vazgeç'
      ]
    });
    alert.addInput({
      type:'text',
      name: 'OldPassword',
      placeholder: 'Şifre'
    });
    alert.addInput({
      type:'text',
      name: 'NewPassword',
      placeholder: 'Yeni şifre'
    });
    alert.addInput({
      type:'text',
      name: 'ConfirmPassword',
      placeholder: 'Teni şifre tekrar'
    });
    alert.addButton({
      text: 'Kaydet',
      handler: (data: any) => {
        this.passwordModel = {
          OldPassword: data.OldPassword,
          NewPassword:data.NewPassword,
          ConfirmPassword:data.ConfirmPassword
        };
        this.changePasswordP();
      }
    });

    alert.present();
  }


  changePasswordP() {
      let loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Giriş yapılıyor.'
      });
  
      loading.present();

      this.userData
        .changePassword(this.passwordModel)
        .subscribe(
          (res) => {
              if(res)
              {
                // this.globalValues.userInfo = JSON.parse(res._body);
                //  this.globalValues.initPushNotificaiton();
                //  if(this.globalValues.userInfo.role == 'HOSTESS')
                //  {
                //   this.events.publish('app:savelocation');
                //  }

                // this.navCtrl.setRoot(TabsPage);
              }
              loading.dismiss()
          },
          err => {            
            loading.dismiss();
            this.handleError(err);
          });
    
  }
  handleError(error: any) {
    
    let message: string;

    if(error.status == 400)
    {
      message = "Hatalı şifre.";
    }
    else
    {
    if (error['_body']) {
      var d = JSON.parse(error['_body']);
      if (d.stat) {
        
      }
      message = d.modelState[0];
    }
    else {
      message = "Şifre değiştirildi."; //+ `${error.statusText}`;
    }
  }
    const toast = this.toastCtrl.create({
      message,
      duration: 5000,
      position: 'bottom'
    });

    toast.present();
  }
  logout() {
    this.userData.logout();
  }

  support() {
    this.nav.push('SupportPage');
  }
}
