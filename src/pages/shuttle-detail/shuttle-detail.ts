import { Component } from '@angular/core';
import { ShuttleData } from '../../providers/shutle';
// import {GlobalValues} from '../../app/global-values';
@Component({
  selector: 'shuttle-detail',
  templateUrl: 'shuttle-detail.html'
})
export class ShuttleDetailPage {

  constructor(
    // public globalValues:GlobalValues
    public shuttleData: ShuttleData,
  ) { 
    this.getShuttleInfo();
    }

    shuttle:any;

    getShuttleInfo() {
  
      this.shuttleData
        .getHostessShuttleInfo()
        .subscribe(
          (sh) => { 
          this.shuttle = sh;
          },
          err => {         
          });
    }

  }
  
