import { Component, ViewChild, ElementRef } from '@angular/core';


import {NavController, Platform,NavParams,LoadingController } from 'ionic-angular';

import { StudentData } from '../../providers/student';
import { GlobalValues } from '../../app/global-values';
import { AboutPage } from '../about/about';
 import { Geolocation } from '@ionic-native/geolocation';
 //import { AndroidPermissions } from '@ionic-native/android-permissions';

declare var google: any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('mapCanvas') mapElement: ElementRef;
  constructor( public navCtrl: NavController,
    //private androidPermissions: AndroidPermissions,
   private geolocation: Geolocation,
    public globalValues:GlobalValues,public loadingCtrl: LoadingController, public platform: Platform,public navParams: NavParams,public studentData:StudentData) {
    // this.lat = this.navParams.get('lat');
    // this.lng = this.navParams.get('lng');
    this.title = this.navParams.get('title');

    this.platform.ready().then(() => {

      if (this.platform.is('android')) {
     
      //  this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
        //  result => {
      
         //   if(Boolean(result.hasPermission) == false || result.hasPermission == 'false')
         //   {
        //      this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
        //    }
       //   },
        //  err => {this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)}
        //);
      }

      try {
     
      this.geolocation.getCurrentPosition().then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
       
        this.initMap(resp.coords.latitude,resp.coords.longitude);
       }).catch((error) => {
         console.log('Error getting location', error);
       });
      } catch (error) {
        alert(error)
      }


    });
  }

  lat:number;
  lng:number;
  title:string;
  map:any;
  studentInfs:any[];

markers:any[] = [];
  getStudentsLocation() {

    


    this.studentData
      .getStudentsLocation(this.globalValues.userInfo.id)
      .subscribe(
        (data) => { 
          this.studentInfs = data;
            this.loadMap();
        },
        err => {      
        });
  }

  goToStudentDetail(studentId: number) {        
    this.globalValues.curStudent = this.globalValues.getStudentById(studentId);
     this.navCtrl.push(AboutPage);
  }

  initMap(lat,lng)
  {
    var mapEle = this.mapElement.nativeElement;
   
      var coords = {
        lat: lat,
        lng: lng, 
      };
    this.map = new google.maps.Map(mapEle, {
      center: coords,
      zoom: 13
    });
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      
      this.getStudentsLocation();
    });  
  }

  loadMap() {
    let cont = `<table>
    <tr>
    <td>
    <b>İsim</b>
    </td>
    <td class="infTd">
    {stName}
    </td>
    </tr>
    <tr>
    <td>
    <b>hostes</b>
    </td>
    <td class="infTd">
    {hName}
    </td>
    </tr>
    <tr>
    <td>
    <b>Plaka</b>
    </td>
    <td class="infTd">
    {plate}
    </td>
    </tr>
    <td>
    </td> 
    <td class="buttonCell">
    </td>      
    </tr>     
    </table>`;

    if (this.studentInfs && this.studentInfs.length > 0) {

      if (this.markers && this.markers.length > 0) {
        for (let index = 0; index <= this.markers .length -1; index++) {
          if (this.markers[index] != null) {
            this.markers[index].setMap(null);
            this.markers[index] = null;
          }
        }    
      }

      for (let index = 0; index <= this.studentInfs.length -1; index++) {

        if (this.studentInfs[index].lattidute == 0) {
          continue;
        }
        
        var _content = document.createElement('div');
        _content.innerHTML = (cont);
        _content.innerHTML = _content.innerHTML.replace(/{stName}/g, this.studentInfs[index].studentName);
        _content.innerHTML = _content.innerHTML.replace(/{hName}/g, this.studentInfs[index].hostessName);
        _content.innerHTML = _content.innerHTML.replace(/{plate}/g, this.studentInfs[index].shuttlePlate); 
        var btnCell = _content.getElementsByClassName('buttonCell')[0];
       
        var button = btnCell.appendChild(document.createElement('input'));
        button.type = 'button';
        button.id = 'showMoreButton';
        button.className = 'disable-hover button button-ios button-clear button-clear-ios button-small button-small-ios button-clear-ios-danger'
        // button.style = 'float:right';
        button.value = 'Detaylar';
         button.addEventListener('click', this.goToStudentDetail.bind(this,this.studentInfs[index].studentId));
    
        let infoWindow = new google.maps.InfoWindow({
          content: _content
        });


        var image = {
          url: this.studentInfs[index].pictureUrl,          
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };

        let marker = new google.maps.Marker({
          position: {
            lat: this.studentInfs[index].lattidute,
            lng: this.studentInfs[index].longtidute
          },
          icon: image,
          map: this.map,
          title: this.studentInfs[index].studentName
        });

        this.markers.push(marker);

        marker.addListener('click', () => {
          infoWindow.open(this.map, marker);
        });
        
      }
      var myoverlay = new google.maps.OverlayView();
      myoverlay.draw = function () {
          this.getPanes().markerLayer.id='markerLayer';
      };
      myoverlay.setMap(this.map);
   

      setTimeout(() => {
        this.getStudentsLocation();
      }, this.globalValues.mapRefreshTime);
    }
  }

}
