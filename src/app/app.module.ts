
import { BrowserModule } from '@angular/platform-browser';
import {RequestOptions, XHRBackend , HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';

import { ConferenceApp } from './app.component';

import { ShuttleDetailPage } from '../pages/shuttle-detail/shuttle-detail';
import { Device } from '@ionic-native/device';

import { ActivityListPage } from '../pages/activity-list/activity-list';

import { AcvtivityDetailPage } from '../pages/acvtivity-detail/acvtivity-detail';
import { AboutPage } from '../pages/about/about';
import { PopoverPage } from '../pages/about-popover/about-popover';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { SchedulePage } from '../pages/schedule/schedule';
import { TabsPage } from '../pages/tabs-page/tabs-page';
import { SupportPage } from '../pages/support/support';
import { StudentEditPage } from '../pages/student-edit/student-edit';

import { UserData } from '../providers/user-data';
import { StudentData } from '../providers/student';
import { HostessData } from '../providers/hostess';
import { ShuttleData } from '../providers/shutle';

import { HttpProvider } from '../providers/http/http';
import {GlobalValues} from "./global-values";
 import { StatusBar } from '@ionic-native/status-bar';
 import {Push} from "@ionic-native/push";

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
//import { AndroidPermissions } from '@ionic-native/android-permissions';

@NgModule({
  declarations: [
    ConferenceApp,
    AboutPage,
    ActivityListPage,
    AcvtivityDetailPage,
    ShuttleDetailPage,
    AccountPage,
    LoginPage,
    MapPage,
    PopoverPage,
    SchedulePage,
    TabsPage,
    StudentEditPage,
    SupportPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(ConferenceApp, {}, {
      links: [
        { component: TabsPage, name: 'TabsPage', segment: 'tabs-page' },
        { component: SchedulePage, name: 'Schedule', segment: 'schedule' },
        { component: StudentEditPage, name: 'StudentEditPage', segment: 'studentEditPage/:studentId' },
        { component: AcvtivityDetailPage, name: 'AcvtivityDetail', segment: 'activity-detail/:studentId' },
       { component: MapPage, name: 'Map', segment: 'map' },
        { component: AboutPage, name: 'About', segment: 'about' },
        { component: ShuttleDetailPage, name: 'ShuttleDetail', segment: 'shuttleDetail' },
        { component: SupportPage, name: 'SupportPage', segment: 'support' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: AccountPage, name: 'AccountPage', segment: 'account' },
      ]
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ConferenceApp,
    AboutPage,
    ShuttleDetailPage,
    AccountPage,
    LoginPage,
    ActivityListPage,
    AcvtivityDetailPage,
    MapPage,
    PopoverPage,
    SchedulePage,
    TabsPage,
    StudentEditPage,
    SupportPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    GlobalValues,
    StudentData,
    StatusBar,
    UserData,
    HostessData,
    ShuttleData,
    Device,
    SplashScreen,   
     //AndroidPermissions,
    Push,
     Geolocation,
    FileTransfer,
    FileTransferObject,
    File,
    Network,
    Camera,
    // BackgroundMode,
    {
      provide: HttpProvider,
      useFactory: (backend: XHRBackend, options: RequestOptions) => {
        return new HttpProvider(backend, options);
      },
      deps: [XHRBackend, RequestOptions]
    },
  ]
})
export class AppModule { }

// import { BrowserModule } from '@angular/platform-browser';
// import { ErrorHandler, NgModule } from '@angular/core';
// import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
// import { SplashScreen } from '@ionic-native/splash-screen';
// import { StatusBar } from '@ionic-native/status-bar';

// import { Device } from '@ionic-native/device';
// import { Dialogs } from '@ionic-native/dialogs';

// import { MyApp } from './app.component';

// @NgModule({
//   declarations: [
//     MyApp
//   ],
//   imports: [
//     BrowserModule,
//     IonicModule.forRoot(MyApp)
//   ],
//   bootstrap: [IonicApp],
//   entryComponents: [
//     MyApp
//   ],
//   providers: [
//     StatusBar,
//     SplashScreen,
//     Device,
//     Dialogs,
//     {provide: ErrorHandler, useClass: IonicErrorHandler}
//   ]
// })
// export class AppModule {}
