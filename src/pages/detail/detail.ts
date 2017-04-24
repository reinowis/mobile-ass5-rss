import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FeedItem, FeedItemContent, FeedService } from '../../providers/feed-service'
import { Observable } from 'rxjs/Observable';
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
  title: string ='';
  intro: string = '';
  preptime: string ='';
  cooktime: string ='';
  yields: string ='';
  ingredients =[];
  methods = [];
  constructor(public navCtrl: NavController, private feedService: FeedService, public navParams: NavParams) {
    this.item = navParams.get("item");
    feedService.getItemContent(this.item.link).subscribe(
      data => {
        this.title = data[0];
        this.intro = data[1];
        this.preptime = data[2];
        this.cooktime = data[3];
        this.yields = data[4];
        this.ingredients = data[5];
        this.methods = data[6]
      }  
    );
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Detail');
  }

}
