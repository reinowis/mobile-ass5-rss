import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, Nav } from 'ionic-angular';
import {Categories} from '../categories/categories';
// import { FeedList } from '../feed-list/feed-list';
import { FeedService, Feed } from '../../providers/feed-service';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Nav) nav: Nav;
  rootPage = Categories;
  feeds: Feed[];
  constructor(private navCtrl: NavController, private feedService: FeedService, public alertCtrl: AlertController) {
    // let newFeed = new Feed('test','http://feeds.feedburner.com/elise/simplyrecipes');
    // this.feeds.push(newFeed);
    this.feeds = feedService.getSavedFeeds();
  }
  public openFeed(feed: Feed) {
    this.navCtrl.push(Categories, {feed: feed});
    // this.nav.setRoot(FeedList, { 'selectedFeed': feed });
  }
}
