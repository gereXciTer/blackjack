/**
* Created with BlackJack.
* User: exciter
* Date: 2014-09-09
* Time: 11:34 PM
* To change this template use Tools | Templates.
*/

var Controller = require('controllers/base/controller');
var Model = require('models/base/model');

var Poller = require('lib/poller');

var DeskModel = require('models/desk');
var StoryModel = require('models/story');

var HeaderView = require('views/home/header-view');
var DeskView = require('views/desk/desk-view');
var StoriesCollectionView = require('views/desk/stories-collection');

var DecksCollection = require('models/decks');
var StoryCollection = require('models/story-collection');


module.exports = Controller.extend({

  viewdesk: function(params){
    this.reuse('header', HeaderView, {region: 'header'});
    
    var _this = this;
    
    var deskModel = new DeskModel({id: params.id});
    
    var storyCollection = new StoryCollection({
      deskId: params.id
    });

    var showDesk = function(model){
      model.set('cards', DecksCollection.at(model.get('deck')).get('cards'));
      _this.view = new DeskView({
        region: 'main',
        model: model
      });
      

      storyCollection.fetch({
        success: function(collection, models){
          _this.refreshStories(collection);
          var poller = Poller();
          poller.get(collection, {delay: 5000}).start();
          var storiesCount = collection.length;
          collection.on('sync', function(collection){
            if(storiesCount !== collection.length){
              _this.refreshStories(collection);
              storiesCount = collection.length;
            }                
          });
        }
      });
    };
    
    Chaplin.mediator.unsubscribe('story:add');
    Chaplin.mediator.subscribe('story:add', function(title){
      var story = new StoryModel();
      story.save({
        "summary": title,
        "estimate": "-1",
        "active": false,
        "revealed": false,
        "deskId": params.id
      },{
        success: function(){
          storyCollection.fetch();
        }
      });
    });
        
    deskModel.fetch({
      success: showDesk
    });
    
  },
  
  refreshStories: function(collection){
    var _this = this;
    var storiesCollectionView = new StoriesCollectionView({
      region: 'stories',
      collection: collection
    });
    _this.view.subview('stories', storiesCollectionView);
  }
  
});
