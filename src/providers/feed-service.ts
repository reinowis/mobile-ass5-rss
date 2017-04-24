import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
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
      },
      {
        title: "Mother's Day",
        url: 'http://www.simplyrecipes.com/recipes/season/mothers_day/',
        type: 'html'
      },
      {
        title: "Fish and Seafood",
        url: "http://www.simplyrecipes.com/recipes/ingredient/fish_and_seafood/",
        type: 'html',
      },
      {
        title: 'Dessert',
        url: 'http://www.simplyrecipes.com/recipes/course/dessert/',
        type: 'html'
      },
      {
        title: 'Pasta',
        url: 'http://www.simplyrecipes.com/recipes/ingredient/pasta/',
        type: 'html'
      },
      {
        title: 'Beef',
        url: 'http://www.simplyrecipes.com/recipes/ingredient/beef/',
        type: 'html'
      },
      {
        title: 'Budget',
        url: 'http://www.simplyrecipes.com/recipes/type/budget/',
        type: 'html'
      },
      {
        title: 'Baking',
        url: 'http://www.simplyrecipes.com/recipes/type/baking/',
        type: 'html'
      },
      {
        title: 'Cookie',
        url: 'http://www.simplyrecipes.com/recipes/type/cookie/',
        type: 'html'
      }
    ];
    return feeds;
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
    var feedItems = [];
    if (feedType == 'rss') {
      var query = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22' + encodeURIComponent(feedUrl) + '%22&format=json&diagnostics=true&callback=';
      return this.http.get(query)
        .map(data => data.json()['query']['results'])
        .map((res) => {
          if (res == null) {
            return feedItems;
          }
          let objects = res['item'];
          for (let i = 0; i < objects.length; i++) {
            let item = objects[i];
            var thumbnail = item.thumbnail.url;
            let newFeedItem = new FeedItem(item.title, item.link, thumbnail);
            feedItems.push(newFeedItem);
          }
          return feedItems;
        });
    }
    else {
      var query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + encodeURIComponent(feedUrl) + "%22%20and%20xpath%3D%22%2F%2Ful%5B%40class%3D%5C'entry-list%5C'%5D%2Fli%22&format=json&diagnostics=true&callback=";
      return this.http.get(query)
        .map(data => data.json()['query']['results'])
        .map((res) => {
          if (res == null) {
            return feedItems;
          }
          let objects = res['li'];
          for (let i = 0; i < objects.length; i++) {
            let item = objects[i];
            var title = item.a.title;
            var link = item.a.href;
            var thumbnail = item.div[0].a.img.src;
            let newFeedItem = new FeedItem(title, link, thumbnail);
            feedItems.push(newFeedItem);
          }
          return feedItems
        });
    }
    // return feedItems;
  }
  public getItemContent(itemUrl: string) {
    return Observable.forkJoin(
      this.getItemTitle(itemUrl),
      this.getItemIntro(itemUrl),
      this.getItemPreptime(itemUrl),
      this.getItemCooktime(itemUrl),
      this.getItemYields(itemUrl),
      this.getItemIngredients(itemUrl),
      this.getItemMethods(itemUrl)
    );
  }
  public getItemTitle(itemUrl: string) {
    var title = "";
    var title_query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + encodeURIComponent(itemUrl) + "%22%20and%20xpath%3D%22%2F%2Fdiv%5B%40class%3D%5C'recipe-callout%5C'%5D%2Fh2%22&format=json&diagnostics=true&callback=";
    return this.http.get(title_query)
      .map(data => data.json()['query']['results'])
      .map((res) => {
        if (res == null)
          return title;
        else
          return res['h2'];
      });
  }
  public getItemIntro(itemUrl: string) {
    var intro = [];
    var intro_query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + encodeURIComponent(itemUrl) + "%22%20and%20xpath%3D%22%2F%2Fdiv%5B%40class%3D%5C%27entry-details%20recipe-intronote%5C%27%5D%2Fp%22&format=json&diagnostics=true&callback=";
    return this.http.get(intro_query)
      .map(data => data.json()['query']['results'])
      .map((res) => {
        if (res == null)
          return intro;
        else {
          let objects = res['p'];
          for (let i = 0; i < objects.length; i++) {
            let item = objects[i];
            if (item.content != null)
              intro.push(item.content);
          }
          return intro;
        }
      });
  }
  public getItemPreptime(itemUrl: string) {
    var preptime = '';
    var preptime_query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + encodeURIComponent(itemUrl) + "%22%20and%20xpath%3D%22%2F%2Fspan%5B%40class%3D%5C'preptime%5C'%5D%22&format=json&diagnostics=true&callback=";
    return this.http.get(preptime_query)
      .map(data => data.json()['query']['results'])
      .map((res) => {
        if (res == null)
          return preptime;
        else
          return res.span.content[1];
      });
  }
  public getItemCooktime(itemUrl: string) {
    var cooktime = '';
    var cooktime_query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + encodeURIComponent(itemUrl) + "%22%20and%20xpath%3D%22%2F%2Fspan%5B%40class%3D%5C%27cooktime%5C%27%5D%22&format=json&diagnostics=true&callback=";
    return this.http.get(cooktime_query)
      .map(data => data.json()['query']['results'])
      .map((res) => {
        if (res == null)
          return cooktime;
        else
          return res.span.content[1];
      });
  }
  public getItemYields(itemUrl: string) {
    var yields = '';
    var yields_query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + encodeURIComponent(itemUrl) + "%22%20and%20xpath%3D%22%2F%2Fspan%5B%40class%3D%5C'yield%5C'%5D%22&format=json&diagnostics=true&callback=";
    return this.http.get(yields_query)
      .map(data => data.json()['query']['results'])
      .map((res) => {
        if (res == null)
          return yields = '';
        return res.span.content;
      });
  }
  public getItemIngredients(itemUrl: string) {
    var ingredients = [];
    var ingredients_query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + encodeURIComponent(itemUrl) + "%22%20and%20xpath%3D%22%2F%2Fdiv%5B%40class%3D%5C'entry-details%20recipe-ingredients%5C'%5D%2Ful%2Fli%22&format=json&diagnostics=true&callback=";
    return this.http.get(ingredients_query)
      .map(data => data.json()['query']['results'])
      .map((res) => {
        if (res == null)
          return ingredients;
        else {
          let objects = res['li'];
          for (let i = 0; i < objects.length; i++) {
            let temp = '';
            let item = objects[i];
            if (item.a != null) {
              temp = item.a.content;
            }
            else
              temp = item.content;
            ingredients.push(temp);
          }
        }
        return ingredients;
      });
  }
  public getItemMethods(itemUrl: string) {
    var methods = [];
    var method_query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + encodeURIComponent(itemUrl) + "%22%20and%20xpath%3D%22%2F%2Fdiv%5B%40itemprop%3D%5C'recipeInstructions%5C'%5D%2Fp%22&format=json&diagnostics=true&callback=";
    return this.http.get(method_query)
      .map(data => data.json()['query']['results'])
      .map((res) => {
        if (res == null)
          return methods;
        else {
          let objects = res['p'];
          for (let i = 0; i < objects.length; i++) {
            let item = objects[i];
            let temp = '';
            if (item.strong != null)
              temp += item.strong;
            if (item.content != null)
              temp += item.content;
            if (temp != '')
              methods.push(temp);
          }
        }
        return methods;
      });
  }
}
