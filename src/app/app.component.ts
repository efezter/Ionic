import { Component, ViewChild,NgZone } from '@angular/core';
import { Events, MenuController, Nav, Platform,ToastController,LoadingController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { StatusBar } from '@ionic-native/status-bar';

import { ShuttleDetailPage } from '../pages/shuttle-detail/shuttle-detail';
 import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
 import { MapPage } from '../pages/map/map';
 import { TabsPage } from '../pages/tabs-page/tabs-page';
import { SchedulePage } from '../pages/schedule/schedule';
import { UserData } from '../providers/user-data';
import { HostessData } from '../providers/hostess';
import { GlobalValues } from './global-values';
import { Network } from '@ionic-native/network';
import { ActivityListPage } from '../pages/activity-list/activity-list';
// import { ShuttleDetailPage } from '../pages/shuttle-detail/shuttle-detail';
// import { BackgroundMode } from '@ionic-native/background-mode';
// import { Network } from '@ionic-native/network';
// import 'rxjs/add/operator/filter';

// import { AndroidPermissions } from '@ionic-native/android-permissions';
export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.template.html'
})
export class ConferenceApp {

// the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;
  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu

   // BackgroundGeolocation instance
   bgGeo: any;

   // UI State
   enabled: boolean;
   isMoving: boolean;
 
   // ion-list datasource
   events: any;


  parentPages: PageInterface[] = [
    { title: 'Öğrenciler', name: 'TabsPage', component: TabsPage, tabComponent: SchedulePage, index: 0, icon: 'body' },
    { title: 'Profil', name: 'TabsPage', component: AccountPage, tabComponent: AccountPage, index: 1, icon: 'contact' },
    { title: 'Harita', name: 'TabsPage', component: TabsPage, tabComponent: MapPage, index: 2, icon: 'map' },
  ];
  hostessPages: PageInterface[] = [
    { title: 'Öğrenciler', name: 'TabsPage', component: TabsPage, tabComponent: SchedulePage, index: 0, icon: 'body' },
    { title: 'Profil', name: 'TabsPage', component: AccountPage, tabComponent: AccountPage, index: 1, icon: 'contact' },
    { title: 'Servis', name: 'TabsPage', component: ShuttleDetailPage, tabComponent: ShuttleDetailPage, index: 2, icon: 'bus' },
  ];
  loggedInPages: PageInterface[] = [
     { title: 'Çıkış', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
  ];
  rootPage: any; 
  flg:boolean = false;
  lastLocSaveDate:Date = new Date();
  ldng:any;
  constructor(
    public statusBar: StatusBar, 
    private network: Network,
    public toastCtrl:ToastController,
    private readonly loadingCtrl: LoadingController,
    public splashScreen: SplashScreen,
    public menu: MenuController,
    public platform: Platform,
    public userData: UserData,
    private zone:NgZone,
    public hostessData:HostessData,
    public ioevents: Events,
    public globalValues: GlobalValues,) {
      this.listenToLoginEvents();
    this.globalValues.getUserInfo();
    this.isMoving = false;
    this.enabled = false;
    this.events = [];
    this.platformReady();
    
  }

  platformReady() {
 
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.watchNetwork();

      if (this.platform.is('ios') || this.platform.is('android'))
      {
        if (this.bgGeo) {
          this.bgGeo = (<any>window).BackgroundGeolocation;
          this.bgGeo.removeListeners();
          this.bgGeo.stop();
        }     
      }
      this.userData.hasLoggedIn().then((hasLoggedIn) => {
     
        if(hasLoggedIn)
        {
         this.ioevents.publish('app:savelocation');
         
          this.nav.setRoot(SchedulePage);
        }
        else
        {
          this.nav.setRoot(LoginPage);
          this.enableMenu(false);
        }
      });
      
       // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();

      // Dark statusbar for Android
      if (this.platform.is('android')) {
        this.statusBar.overlaysWebView(false);
        this.statusBar.backgroundColorByHexString('#272727');
      }
      
    });
  }
  watchNetwork()
  {
  
   this.ldng = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'İnternete bağlanılamıyor.'
    });

    
  this.network.onDisconnect().subscribe(() => {
   
      this.ldng.present();
    });     

  this.network.onConnect().subscribe(() => {
     
      console.log('Network connected!');
      this.ldng.dismiss();
    });

  }
  insertLocation() { 
     
    let secondBetweenTwoDate = Math.abs((new Date().getTime() - this.lastLocSaveDate.getTime()) / 1000);
                                
    if ((this.flg == false) || (secondBetweenTwoDate >= (this.globalValues.locationSaveTime / 1000))) {
     this.flg = true;
      this.lastLocSaveDate = new Date();
      this.hostessData
      .insertLocation(this.globalValues.lat, this.globalValues.lng)
      .subscribe(
        (resp) => { 
          const toast = this.toastCtrl.create({
            message:'loc saved.',
            duration: 5000,
            position: 'bottom'
          });
      
          toast.present();
        },
        err => {    
           alert('loc' + err) ;  
        });
    }  
  }

  initBGGeolocation() {

      // Compose #url: tracker.transistorsoft.com/locations/{username}
      let localStorage = (<any>window).localStorage;
      let url = "http://app.bilicra.com:85/Values/InsertLocation";
  
      // Get reference to BackgroundGeolocation API
      this.bgGeo = (<any>window).BackgroundGeolocation;

    if (this.bgGeo && this.platform.is('ios') || this.platform.is('android')) {     
   
    // Compose #url: tracker.transistorsoft.com/locations/{username}
    let localStorage = (<any>window).localStorage;
    let url = "http://app.bilicra.com:85/Values/InsertLocation";

    // Get reference to BackgroundGeolocation API
    this.bgGeo = (<any>window).BackgroundGeolocation;

    // Step 1:  Listen to events
    this.bgGeo.on('location', this.onLocation.bind(this));
    this.bgGeo.on('motionchange', this.onMotionChange.bind(this));
    this.bgGeo.on('activitychange', this.onActivityChange.bind(this));
    this.bgGeo.on('http', this.onHttpSuccess.bind(this), this.onHttpFailure.bind(this));
    this.bgGeo.on('providerchange', this.onProviderChange.bind(this));
    this.bgGeo.on('powersavechange', this.onPowerSaveChange.bind(this));
    let token = localStorage.getItem('auth_token');
    // Step 2:  Configure the plugin
    this.bgGeo.configure({
      debug: false,
      logLevel: this.bgGeo.LOG_LEVEL_VERBOSE,
      distanceFilter: 20,
      stopTimeout: 1,
      preventSuspend:true,
      httpTimeout:60000,
     stopOnTerminate: false,
      startOnBoot: true,
      foregroundService: true,
      url: url,
      autoSync: true,
      headers: {
          'Authorization': "Bearer " + token
      },
      params: {
          //latidute: '111', longtidute: '1111'
          // device: {  // <-- required for tracker.transistorsoft.com
          //   platform: this.device.platform,
          //   version: this.device.version,
          //   uuid: this.device.uuid,
          //   cordova: this.device.cordova,
          //   model: this.device.model,
          //   manufacturer: this.device.manufacturer,
          //   framework: 'Cordova'
          // }
      }
    }, (state) => {
      console.log('- Configure success: ', state);
      // Update UI state (toggle switch, changePace button)
      this.zone.run(() => {
        this.isMoving = state.isMoving;
        this.enabled = state.enabled;
      });
    });
    this.bgGeo.start();
  }
  }

  /**
  * @event http
  */
 onHttpSuccess(response) {
  console.log('[event] http: ', response);
  this.zone.run(() => {
    this.addEvent('http', new Date(), response);
  });
}
onHttpFailure(response) {
  console.warn('[event] http failure: ', response);
  this.zone.run(() => {
    this.addEvent('http failure', new Date(), response);
  });
}
/**
* @event providerchange
*/
onProviderChange(provider) {
  console.log('[event] providerchange', provider);
  this.zone.run(() => {
    this.addEvent('providerchange', new Date(), provider);
  });
}
/**
* @event powersavechange
*/
onPowerSaveChange(isPowerSaveEnabled) {
  console.log('[event] powersavechange', isPowerSaveEnabled);
  this.zone.run(() => {
    this.addEvent('powersavechange', new Date(), {isPowerSaveEnabled: isPowerSaveEnabled});
  });
}

  /**
  * @event motionchange
  */
 onMotionChange(isMoving, location) {
  console.log('[event] motionchange, isMoving: ', isMoving, ', location: ', location);
  this.zone.run(() => {
    this.isMoving = isMoving;
  });
}
/**
* @event activitychange
*/
onActivityChange(event) {
  console.log('[event] activitychange: ', event);
  this.zone.run(() => {
    this.addEvent('activitychange', new Date(), event);
  });
}
  
  /**
  * @event location
  */
 onLocation(location) {
   //speed
   this.globalValues.lng = location.coords.longitude
   this.globalValues.lat = location.coords.latitude
  //  this.insertLocation();
  console.log('[event] location: ', location);
  let event = location.event || 'location';

  this.zone.run(() => {
    this.addEvent(event, new Date(location.timestamp), location);
  })
}


  /**
  * Add a record to ion-list
  * @param {String} event name
  * @param {Date} date
  * @param {Object} event object, eg: {location}, {provider}, {activity}
  */
 private addEvent(name, date, event) {
  let timestamp = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

  this.events.unshift({
    name: name,
    timestamp: timestamp,
    object: event,
    content: JSON.stringify(event, null, 2)
  });
}


  listenToLoginEvents() {
    this.ioevents.subscribe('user:login', () => {  
      this.enableMenu(true);
    });
    this.ioevents.subscribe('app:openpage', () => {   
      this.nav.push(ActivityListPage);
    });

    this.ioevents.subscribe('app:savelocation', () => {   
    
          if(this.globalValues.userInfo && this.globalValues.userInfo.role == 'HOSTESS')
          {           
            this.initBGGeolocation();          
          }       
    });
    this.ioevents.subscribe('user:logout', () => {

      if(this.bgGeo && this.globalValues.userInfo && this.globalValues.userInfo.role == 'HOSTESS')
      {
        this.bgGeo.stop();  
      }  
      
      // if (this.watch) {
      //   this.watch.unsubscribe();
      // }
      this.enableMenu(false);
      this.nav.setRoot(LoginPage);
     
    });
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNavs()[0];

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }


  openPage(page: PageInterface) {
    let params = {};

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      params = { tabIndex: page.index };
    }
    // If we are already on tabs just change the selected tab
    // don't setRoot again, this maintains the history stack of the
    // tabs even if changing them from the menu
    if (this.nav.getActiveChildNavs().length && page.index != undefined) {
      this.nav.getActiveChildNavs()[0].select(page.index);
    } else {
      // Set the root of the nav with params if it's a tab index
      this.nav.setRoot(page.component, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      this.userData.logout();
    }
  }
}

