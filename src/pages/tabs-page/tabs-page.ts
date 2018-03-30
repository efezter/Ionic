import { Component } from '@angular/core';

import { NavParams, NavController } from 'ionic-angular';

// import { AccountPage } from '../account/account';
// import { AboutPage } from '../about/about';
import { MapPage } from '../map/map';
import { ShuttleDetailPage } from '../shuttle-detail/shuttle-detail';
import { SchedulePage } from '../schedule/schedule';
import {GlobalValues} from '../../app/global-values';
import { AccountPage } from '../account/account';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = SchedulePage;
  tab2Root: any;
   tab3Root: any;
  // tab4Root: any = AboutPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams,public globalValues:GlobalValues, public navCtrl: NavController,) {

    if (this.globalValues.userInfo.role  == 'HOSTESS') {
      this.tab2Root = ShuttleDetailPage;
    }
    else
    {
      this.tab2Root = MapPage;
    }
      this.mySelectedIndex = navParams.data.tabIndex || 0;
      this.tab3Root = AccountPage;
  }

}
