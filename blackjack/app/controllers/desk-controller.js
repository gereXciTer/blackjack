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
var VoteModel = require('models/vote');

var ErrorView = require('views/home/error404-view');

var HeaderView = require('views/home/header-view');
var DeskView = require('views/desk/desk-view');
var StoriesCollectionView = require('views/desk/stories-collection');

var DecksCollection = require('models/decks');
var StoryCollection = require('models/story-collection');
var VotesCollection = require('models/votes-collection');

module.exports = Controller.extend({

  viewdesk: function(params){
    this.reuse('header', HeaderView, {region: 'header'});
    
    var _this = this;
    
    var deskModel = new DeskModel({id: params.id});
    
    var storyCollection = new StoryCollection({
      deskId: params.id
    });

    var votesPoller = Poller();
    var storiesPoller = Poller();

    var showDesk = function(model){
      Application.desk = model.getAttributes();
      _this.view = new DeskView({
        region: 'main',
        model: model
      });
      

      var poller = _.find(Application.pollers, function(item){
        return item.name == 'story';
      });
      if(poller && poller.poller.stop){
        poller.poller.stop();
        poller.poller.start();
      }else{
        Application.pollers.push({name: 'story', poller: storiesPoller.get(storyCollection, {delay: Application.pollerConfig.getFreq('story')}).start()});
      }

      var storiesCount = storyCollection.length;
      var lastActiveStory = storyCollection.findWhere({active: true}) ? storyCollection.findWhere({active: true}).get('_id') : '-1';

      var lastRevealedStory = storyCollection.findWhere({active: true, revealed: true}) || false;
      var lastRevealedStoryId = lastRevealedStory ? lastRevealedStory.get('_id') : false;

      storyCollection.on('sync', function(collection){
        refreshed = false;
        collection = storyCollection;
        var lastRevealedStory = collection.findWhere({active: true, revealed: true}) || false;
        if(storiesCount !== collection.length){
          _this.refreshStories(collection);
          refreshed = true;
        }else{
          if(lastActiveStory !== collection.findWhere({active: true}).get('_id')){
            _this.refreshStories(collection);
          	refreshed = true;
          }else{
            if(lastRevealedStoryId !== (lastRevealedStory ? lastRevealedStory.get('_id') : false)){
              _this.refreshStories(collection);
          		refreshed = true;
            }              
          }              
        }
        if(refreshed){
          storiesCount = collection.length;
          lastActiveStory = collection.findWhere({active: true}).get('_id');
          lastRevealedStoryId = lastRevealedStory ? lastRevealedStory.get('_id') : false;
        }
      });

    };
    
    Chaplin.mediator.unsubscribe('story:refresh');
    Chaplin.mediator.subscribe('story:refresh', function(collection){
      collection.fetch();
    });

    Chaplin.mediator.unsubscribe('story:add');
    Chaplin.mediator.subscribe('story:add', function(title){
	    Chaplin.mediator.publish('loader:show');
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
        
    Chaplin.mediator.unsubscribe('vote:refresh');
    Chaplin.mediator.subscribe('vote:refresh', function(params){
      var votesCollection = new VotesCollection({
          storyId: params.storyId
        });
			
      var drawVotes = function(collection, container){
        var isRevealed = params.model.get('revealed');
        container = container.html('<ul class="votes-list"></ul>').find('.votes-list');
        var template = require('views/desk/templates/vote');
        collection.each(function(item){
          container.append('<li class="vote">' + template(_.extend(item.getAttributes(), {isRevealed: isRevealed})) + '</li>');          
        });
      };

      var poller = _.find(Application.pollers, function(item){
        return item.name == 'vote';
      });
      if(poller && poller.poller.stop){
        poller.poller.stop();
        poller.poller.start();
      }else{
        Application.pollers.push({name: 'vote', poller: votesPoller.get(votesCollection, {delay: Application.pollerConfig.getFreq('vote')}).start()});
      }

      if(params.callback){
        params.callback(votesCollection);
      }
      votesCollection.on('sync', function(collection){
        if(collection.length){
          var container = _this.view.$el.find('.story .votes');
          if(collection.length){
            drawVotes(collection, container);
          }
        }
      });

    });

    Chaplin.mediator.unsubscribe('vote:add');
    Chaplin.mediator.subscribe('vote:add', function(params){
	    Chaplin.mediator.publish('loader:show');
      var story = new VoteModel();
      story.save({
        "storyId": params.storyId,
        "estimate": params.estimate
      },{
        success: function(){
          var callback = function(){
            Chaplin.mediator.publish('loader:hide');
          }
	    		Chaplin.mediator.publish('vote:refresh', {storyId: params.storyId, view: params.view, callback: params.callback});
        },
        error: function(){
					console.log('Error adding vote', arguments);          
        }
      });
    });

    deskModel.fetch({
      success: showDesk,
      error: function(){
        Chaplin.utils.redirectTo('home#error404');
      }
    });
    
  },
  
  refreshStories: function(collection){
    var _this = this;
    var storiesCollectionView = new StoriesCollectionView({
      region: 'stories',
      collection: collection
    });
    _this.view.subview('stories', storiesCollectionView);
    Chaplin.mediator.publish('loader:hide');
  }
  
});
