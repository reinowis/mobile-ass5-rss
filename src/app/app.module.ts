import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
// import {FeedList} from '../pages/feed-list/feed-list';
import {Categories} from '../pages/categories/categories';
import {Detail} from '../pages/detail/detail';
import {FeedService} from '../providers/feed-service';
import {IonicStorageModule} from '@ionic/storage';
import {HttpModule, JsonpModule} from '@angular/http';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Categories,
    Detail
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    JsonpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Categories,
    Detail
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FeedService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
