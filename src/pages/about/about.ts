import { Component } from '@angular/core';

import {GlobalValues} from '../../app/global-values';
import { ShuttleData } from '../../providers/shutle';
import { NavController } from 'ionic-angular';
import { StudentEditPage } from '../student-edit/student-edit';
import { ActivityListPage } from '../activity-list/activity-list';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  conferenceDate = '2047-05-17';

  constructor(
    public navCtrl: NavController,
    public shuttleData: ShuttleData,
    public globalValues:GlobalValues) {  

      if (this.globalValues.userInfo.role == 'HOSTESS') {
        this.getHostessShuttleInfo();
      }
      else
      {
        this.getStudShuttleInfo();
      }
       
    }
    shuttle:any;

    goActivityDetail()
    {
      this.navCtrl.push(ActivityListPage);
    }

    getStudShuttleInfo() {
      this.shuttleData
        .getStudShuttleInfo(this.globalValues.curStudent.id)
        .subscribe(
          (sh) => { 
          this.shuttle = sh;
          },
          err => {         
          });
    }

    getHostessShuttleInfo() {
  
      this.shuttleData
        .getHostessShuttleInfo()
        .subscribe(
          (sh) => { 
          this.shuttle = sh;
          },
          err => {         
          });
    }


    openEdit()
    {
      this.navCtrl.push(StudentEditPage);
    }

}
