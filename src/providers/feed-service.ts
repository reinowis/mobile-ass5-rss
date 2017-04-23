import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
/*
  Generated class for the FeedService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
export class FeedItem {
  title: string;
  link: string;
  thumbnail: string;
  constructor(title: string, link: string, thumbnail: string) {
    this.title = title;
    this.link = link;
    this.thumbnail = thumbnail;
  }
}
export class FeedItemContent {
  title: string;
  intro: string[];
  preptime: string;
  cooktime: string;
  yields: string;
  ingredients: Array<string>;
  methods: string[];
  constructor(title: string, intro: string[], preptime: string,
    cooktime: string, yields: string, ingredients: Array<string>, methods: string[]) {
    this.title = title;
    this.intro = intro;
    this.preptime = preptime;
    this.cooktime = cooktime;
    this.yields = yields;
    this.ingredients = ingredients;
    this.methods = methods;
  }
}
export class Feed {
  title: string;
  url: string;
  type: string;
  constructor(title: string, url: string, type: string) {
    this.title = title;
    this.url = url;
    this.type = type;
  }
}
@Injectable()
export class FeedService {
  feedItems: FeedItem[];
  feedItemContent: FeedItemContent;
  constructor(public http: Http, public storage: Storage) { }
  public getSavedFeeds() {
    let feeds = [
      {
        title: "Vegetarian",
        url: 'http://feeds.feedburner.com/SimplyRecipesVegetarian',
        type: 'rss'
      },
      {
        title: "Low Carb",
        url: 'http://feeds.feedburner.com/SimplyRecipesLowCarb',
        type: 'rss'
      },
      {
        title: 'Simply',
        url: 'http://feeds.feedburner.com/elise/simplyrecipes',
        type: 'rss'
      }
    ];
    return feeds;
    // return this.storage.get('savedFeeds').then(data => {
    //   let objFromString = JSON.parse(data);
    //   if (data !== null && data !== undefined) {
    //     return JSON.parse(data);
    //   } else {
    //     return [];
    //   }
    // });
  }

  public addFeed(newFeed: Feed) {
    // return this.getSavedFeeds().then(arrayOfFeeds => {
    //   arrayOfFeeds.push(newFeed)
    //   let jsonString = JSON.stringify(arrayOfFeeds);
    //   return this.storage.set('savedFeeds', jsonString);
    // });
  }

  public getArticlesForUrl(feedUrl: string, feedType: string) {
    // let articles = [];
    var feedItems: FeedItem[];
    if (feedType == 'rss') {
      var query = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22' + encodeURIComponent(feedUrl) + '%22&format=json&diagnostics=true&callback=';
      this.http.get(query)
        .map(data => data.json()['query']['results'])
        .map((res) => {
          if (res == null) {
            feedItems = [];
          }
          let objects = res['item'];
          var length = 20;
          for (let i = 0; i < objects.length; i++) {
            let item = objects[i];
            var thumbnail = item.thumbnail.url;
            let newFeedItem = new FeedItem(item.title, item.link, thumbnail);
            feedItems.push(newFeedItem);
            // this.feedItems.push(newFeedItem);
            // articles.push(newFeedItem);
          }
          // return this.feedItems;
          // return articles
        });
    }
    else {
      var query = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22' + encodeURIComponent(feedUrl) + '%22&format=json&diagnostics=true&callback=';
      this.http.get(query)
        .map(data => data.json()['query']['results'])
        .map((res) => {
          if (res == null) {
            feedItems = [];
          }
          let objects = res['li'];
          var length = 20;
          for (let i = 0; i < objects.length; i++) {
            let item = objects[i];
            var title = item.a.title;
            var link = item.a.href;
            var thumbnail = item.div[0].a.img.src;
            let newFeedItem = new FeedItem(title, link, thumbnail);
            feedItems.push(newFeedItem);
          }
          // return this.feedItems
        });
    }
    return feedItems;
  }
  public getItemContent(itemUrl: string) {
      var title = '';
      var intro =[];
      var preptime ='';
      var cooktime = '';
      var yields = '';
      var ingredients = [];
      var methods = [];
      var title_query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+encodeURIComponent(itemUrl)+"%22%20and%20xpath%3D%22%2F%2Fdiv%5B%40class%3D%5C'recipe-callout%5C'%5D%2Fh2%22&format=json&diagnostics=true&callback=";
      this.http.get(title_query)
      .map(data=>data.json()['query']['results'])
      .map((res)=>{
        if (res == null)
          title = '';
        else 
          title = res['h2'];
      });
      var preptime_query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+encodeURIComponent(itemUrl)+"%22%20and%20xpath%3D%22%2F%2Fspan%5B%40class%3D%5C'preptime%5C'%5D%22&format=json&diagnostics=true&callback=";
      this.http.get(preptime_query)
      .map(data=>data.json()['query']['results'])
      .map((res)=>{
        if (res == null)
          preptime = '';
        else 
          preptime = res.span.content[1];
      });
      var cooktime_query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+encodeURIComponent(itemUrl)+"%22%20and%20xpath%3D%22%2F%2Fspan%5B%40class%3D%5C%27cooktime%5C%27%5D%22&format=json&diagnostics=true&callback=";
      this.http.get(cooktime_query)
      .map(data=>data.json()['query']['results'])
      .map((res)=>{
        if (res == null)
          cooktime = '';
        else
          cooktime = res.span.content[1];
      });
      var intro_query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+encodeURIComponent(itemUrl)+"%22%20and%20xpath%3D%22%2F%2Fdiv%5B%40class%3D%5C%27entry-details%20recipe-intronote%5C%27%5D%2Fp%22&format=json&diagnostics=true&callback=";
      this.http.get(intro_query)
      .map(data=>data.json()['query']['results'])
      .map((res)=>{
        if (res== null)
          intro = [];
        else
        {  
          let objects = res['p'];
          for (let i = 0; i < objects.length; i++)
          {
              let item = objects[i];
              if (item.content != null) 
                intro.push(item.content);
          }
        }
      });
      var ingredients_query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+encodeURIComponent(itemUrl)+"%22%20and%20xpath%3D%22%2F%2Fdiv%5B%40class%3D%5C'entry-details%20recipe-ingredients%5C'%5D%2Ful%2Fli%22&format=json&diagnostics=true&callback=";
      this.http.get(ingredients_query)
      .map(data=>data.json()['query']['results'])
      .map((res)=>{
        if (res== null)
          ingredients =  [];
        else
        {
          let objects = res['li'];
          for (let i = 0; i < objects.length; i++)
          {
              let item = objects[i];
              ingredients.push(item.content);
          }
        }
      });
      var yields_query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+encodeURIComponent(itemUrl)+"%22%20and%20xpath%3D%22%2F%2Fspan%5B%40class%3D%5C'yield%5C'%5D%22&format=json&diagnostics=true&callback=";
      this.http.get(yields_query)
      .map(data => data.json()['query']['results'])
      .map((res)=>{
        if (res == null)
          yields = '';
        yields = res.span.content;  
      });
      var method_query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+encodeURIComponent(itemUrl)+"%22%20and%20xpath%3D%22%2F%2Fdiv%5B%40itemprop%3D%5C'recipeInstructions%5C'%5D%2Fp%22&format=json&diagnostics=true&callback=";
      this.http.get(method_query)
      .map(data=>data.json()['query']['results'])
      .map((res)=>{
        if (res== null)
          methods =  [];
        else
        {
          let objects = res['p'];
          for (let i = 0; i < objects.length; i++)
          {
              let item = objects[i];
              if (item.content != null)
                methods.push(item.content);
          }
        }
      });
      var feedItemContent = new FeedItemContent(title,intro, preptime,cooktime,yields, ingredients,methods);
      return feedItemContent;
  }
}
