import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Feed, FeedItem, FeedService} from '../../providers/feed-service';
import {Detail} from '../detail/detail';
import { Observable } from 'rxjs/Observable';
/**
 * Generated class for the Categories page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class Categories {
  feed:Feed;
  feedItems: FeedItem[];
  constructor(public navCtrl: NavController, private feedService:FeedService,public navParams: NavParams) {
    this.feed = navParams.get('feed');
    feedService.getArticlesForUrl(this.feed.url, this.feed.type).subscribe(
res =>{
  this.feedItems = res;
}
    );
  }
openItem(item: FeedItem)
{
  this.navCtrl.push(Detail,{item: item});
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad Categories');
  }

}
