import { Component, ViewChild } from '@angular/core';

import { AlertController,Platform, App, FabContainer, ItemSliding, List, ModalController, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';

import { UserData } from '../../providers/user-data';
import { StudentData } from '../../providers/student';

// import { SessionDetailPage } from '../session-detail/session-detail';
import { AboutPage } from '../about/about';
import {GlobalValues} from '../../app/global-values';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage {
  // the list is a child of the schedule page
  // @ViewChild('scheduleList') gets a reference to the list
  // with the variable #scheduleList, `read: List` tells it to return
  // the List and not a reference to the element
  @ViewChild('scheduleList', { read: List }) scheduleList: List;

  dayIndex = 0;
  queryText = '';
  excludeTracks: any = [];
  shownSessions: any = [];
  students: any = [];
  confDate: string;

  constructor(
    public platform: Platform,
    public alertCtrl: AlertController,
    public app: App,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public user: UserData,
    public studentData: StudentData,
    public globalValues:GlobalValues
  ) {}
  
ionViewDidLoad() {
    this.getStudents();
  }


  getStudents(refresher:Refresher = null) {
    try {      
    


    this.studentData
      .fetchStudents()
      .subscribe(
        (studs) => { 
          if(refresher){
          refresher.complete();
          }

    this.students = studs;  

  localStorage.setItem('students',JSON.stringify( this.students));
           
           
        },
        err => {         
          if(refresher)
          refresher.complete();
             
        });

      } catch (error) {
      alert(error)
      }
  }

  InsertActivity(student:any) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'İşlem gerçekleştiriliyor.'
    });

    loading.present();

    this.studentData
      .insertActivity(student.id,!student.isTaken,this.globalValues.lat, this.globalValues.lng)
      .subscribe(
        (resp) => { 


  if (resp.success == 1)
  {
    student.isTaken = !student.isTaken; 
  }
  else
  {

    alert(resp.message);
  }

            localStorage.setItem('students',JSON.stringify( this.students));
           
            loading.dismiss()
        },
        err => {    
          alert(err)        
          loading.dismiss();
        });
  }

  // presentFilter() {
  //   let modal = this.modalCtrl.create(ScheduleFilterPage, this.excludeTracks);
  //   modal.present();

  //   modal.onWillDismiss((data: any[]) => {
  //     if (data) {
  //       this.excludeTracks = data;
  //       this.updateSchedule();
  //     }
  //   });
  // }

  // goToSessionDetail(sessionData: any) {
  //   // go to the session detail page
  //   // and pass in the session data

  //   this.navCtrl.push(SessionDetailPage, { sessionId: sessionData.id, name: sessionData.name });
  // }

  goToStudentDetail(sessionData: any) {      
    this.globalValues.curStudent = sessionData;
     this.navCtrl.push(AboutPage);
  }

  addFavorite(slidingItem: ItemSliding, sessionData: any) {

    let confirm = this.alertCtrl.create({
      title: 'Uyarı',
      message: 'Onaylıyor musunuz?',
      buttons: [
        {
          text: 'Hayır',
          handler: () => {
            slidingItem.close();
          }
        },
        {
          text: 'Evet',
          handler: () => {
        
            slidingItem.close();
            this.InsertActivity(sessionData);       
         
          }
        }
      ]
    });
    confirm.present();  
  }

 updateSchedule()
  {
  
  }

  removeFavorite(slidingItem: ItemSliding, sessionData: any, title: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(sessionData.name);
            // this.updateSchedule();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }

  openSocial(network: string, fab: FabContainer) {
    let loading = this.loadingCtrl.create({
      content: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    loading.onWillDismiss(() => {
      fab.close();
    });
    loading.present();
  }

  doRefresh(refresher: Refresher) {
    this.getStudents(refresher);
  }
}
