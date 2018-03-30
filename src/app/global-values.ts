import { Injectable} from '@angular/core';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Platform,AlertController,App,Events} from 'ionic-angular';
import { UserData } from '../providers/user-data';
import { HostessData } from '../providers/hostess';

@Injectable()
export class GlobalValues {

  constructor(
    public userData: UserData,
   private push: Push,
    public platform: Platform,
    public alertCtrl: AlertController,
    public app: App,
    public hostessData: HostessData,
    public events: Events
) {
this.getStudents();
    this.getUserInfo();
  }

    public userInfo:any;
    public students:any[];
    public curStudent:any;
   public lat:number = 0;
     public lng:number = 0;
     public items:any[] = [];
     public pushObject: PushObject;
   
    public mapRefreshTime:number = 15000;
    public locationSaveTime:number = 15000;


    public initPushNotificaiton()
    {

        if (!this.platform.is('cordova')) {
          console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");

          return;
        }
      
        const options: PushOptions = {
          android: {
            senderID:'857357853121'
          },
          ios: {
            alert: "true",
            badge: "true",
            sound: "true"
          },
          windows: {}
        };
        this.pushObject = this.push.init(options);

       

        this.pushObject.on('registration').subscribe((data: any) => {
          // alert(data.registrationId);
          let isIos:boolean =  false;
     
          if(this.platform.is('ios'))
          {
            isIos = true;
          }
       
          // alert(localStorage.getItem('auth_token') + "-----------" + data.registrationId);
          // this.pushToken = data.registrationId;
           this.userData.saveUserPushInfo(data.registrationId,isIos).subscribe(() =>{

           });
        //   // this.globalValues.refreshBadge();
        //   //TODO - send device token to server
         });

         

        this.pushObject.on('notification').subscribe((data: any) => {

          this.getStudents();
          // this.setBadge(data.message,data.count);
          
          this.pushObject.getApplicationIconBadgeNumber().then((n) =>{          
            n = n+1;
            this.pushObject.setApplicationIconBadgeNumber(n);
          });
          // this.globalValues.setBadge(data.count);
          //if user using app and push notification comes
          if (data.additionalData.foreground) {
            // if application open, show popup

            let studentId = parseInt(data.message.split('|~|')[1]);

            

            this.curStudent = this.students.find(x=> x.id == studentId);
        

            let confirmAlert = this.alertCtrl.create({
              title: 'Bildirim',
              message: data.message.split('|~|')[0],
              buttons: [{
                text: 'Tamam',
                role: 'cancel'
              },
              {
                text: 'Lokasyon',
                handler: () => {    
                  try {
                    this.events.publish('app:openpage');
                  } catch (error) {
                    alert(error);
                  }           
                 
                }
              }
            ]
            });
            confirmAlert.present();
          } else {
            //if user NOT using app and push notification comes
            //TODO: Your logic on click of push notification directly
            // this.nav.push(DetailsPage, {message: data.message});
            let studentId = parseInt(data.message.split('|~|')[1]);

            this.curStudent = this.students.find(x=> x.id == studentId);

            this.events.publish('app:openpage');
            console.log("Push notification clicked");
          }
        });

      this.pushObject.on('error').subscribe(error => alert('Error with Push plugin:' +  error));
    }

    clearBadge()
    {
      this.pushObject.setApplicationIconBadgeNumber(0);
      this.pushObject.clearAllNotifications();
    }

    getUserInfo()
    {
      var usrInfStr = localStorage.getItem("userInfo");

      if(usrInfStr)
      {
        this.userInfo = JSON.parse(usrInfStr);
      }
    }

    getStudents()
    {
      var studInfStr = localStorage.getItem("students");

      if(studInfStr)
      {
        this.students = JSON.parse(studInfStr);
      }
    }

   public getStudentById(id:number)
    {
      if (!this.students || this.students.length == 0) {
        this.getStudents();
      }
       return this.students.find(x => x.id == id);
    }
}

