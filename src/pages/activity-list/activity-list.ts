import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { StudentData } from '../../providers/student';
import { AcvtivityDetailPage } from '../acvtivity-detail/acvtivity-detail';
import {GlobalValues} from '../../app/global-values';
/**
 * Generated class for the ActivityListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-activity-list',
  templateUrl: 'activity-list.html',
})
export class ActivityListPage {

  constructor(public loading:LoadingController, public navCtrl: NavController, public navParams: NavParams,public studentData:StudentData,public gb:GlobalValues) {
    this.gb.clearBadge();
    this.getActivities();
  }

  activities:any[] = [];
  infScr:any;
  SkipCount:number= 0;
  MaxResultCount:number = 15;

  goToDetail(_actDetail:any)
  {
    this.navCtrl.push(AcvtivityDetailPage, {actDetail:_actDetail});
  }
 
  getActivities(refresher = null,infiniteScr = null) {  

    let loading = this.loading.create({
      spinner: 'bubbles',
      content: 'Kayılar getiriliyor.'
    });

    loading.present();

    if (infiniteScr) {
      this.SkipCount = this.activities.length;
      this.infScr = infiniteScr;
    }

    if(refresher)
    {
      this.activities = []; 
      this.SkipCount = 0;   
       if (this.infScr) {
      this.infScr.enable(true);
      }

    }  

     
      this.studentData
      .getActivities(this.gb.curStudent.id,this.SkipCount)
      .subscribe(
        (res) => {
          loading.dismiss();
            if(res)
            {            
              Array.prototype.push.apply(this.activities, res);  
            }

            if(this.infScr)
            {                          
              this.infScr.complete();
              if(res.length < this.MaxResultCount)
              {
                this.infScr.enable(false);
              }
            }
            if(refresher)
            refresher.complete();
        },
        err => {
          loading.dismiss();
          if(refresher)
          refresher.complete();

          if(infiniteScr)
          infiniteScr.complete();
        });   
    
  }

}
