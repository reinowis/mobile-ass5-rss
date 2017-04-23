import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FeedItem, FeedItemContent, FeedService} from '../../providers/feed-service'
/**
 * Generated class for the Detail page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class Detail {
  item: FeedItem;
  content: FeedItemContent;
  constructor(public navCtrl: NavController, private feedService: FeedService, public navParams: NavParams) {
  this.item = navParams.get("item");
  this.content = feedService.getItemContent(this.item.link);
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad Detail');
  }

}
