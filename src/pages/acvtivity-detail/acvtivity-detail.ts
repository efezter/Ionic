import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var google: any;
/**
 * Generated class for the AcvtivityDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-acvtivity-detail',
  templateUrl: 'acvtivity-detail.html',
})
export class AcvtivityDetailPage {

  @ViewChild('mapCanvas1') mapElement: ElementRef;
  
actDetail:any;
map:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.actDetail = this.navParams.data.actDetail;
   
  }

  ionViewWillEnter()
  {
    var mapEle = this.mapElement.nativeElement;
      var coords = {
        lat: this.actDetail.lattidute,
        lng: this.actDetail.longtidute, 
      };
    this.map = new google.maps.Map(mapEle, {
      center: coords,
      zoom: 13
    });
    this.loadMap();

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      
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
    </table>`;

        
        var _content = document.createElement('div');
        _content.innerHTML = (cont);
        _content.innerHTML = _content.innerHTML.replace(/{stName}/g, this.actDetail.studentName);
        _content.innerHTML = _content.innerHTML.replace(/{hName}/g, this.actDetail.hostesName);
        _content.innerHTML = _content.innerHTML.replace(/{plate}/g, this.actDetail.plate);     
      
    
        let infoWindow = new google.maps.InfoWindow({
          content: _content
        });


        var image = {
          url: this.actDetail.studentPic,          
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };

        let marker = new google.maps.Marker({
          position: {
            lat: this.actDetail.lattidute,
            lng: this.actDetail.longtidute
          },
          icon: image,
          map: this.map,
          title: this.actDetail.studentName
        });

        marker.addListener('click', () => {
          infoWindow.open(this.map, marker);
        });
        
      
      var myoverlay = new google.maps.OverlayView();
      myoverlay.draw = function () {
          this.getPanes().markerLayer.id='markerLayer';
      };
      myoverlay.setMap(this.map);
  }

}
