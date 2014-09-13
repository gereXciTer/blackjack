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
      

      storyCollection.fetch({
        success: function(collection, models){
          _this.refreshStories(collection);
          Chaplin.mediator.publish('loader:hide');

          var poller = _.find(Application.pollers, function(item){
            return item == 'story';
          });
          if(poller && poller.stop){
            poller.stop();
          }
          Application.pollers.push({name: 'story', poller: storiesPoller.get(collection, {delay: 5000}).start()});
          
          var storiesCount = collection.length;
          var lastActiveStory = collection.findWhere({active: true}).get('_id');
          
          
          collection.on('sync', function(collection){
            if(storiesCount !== collection.length){
              _this.refreshStories(collection);
              storiesCount = collection.length;
            }              
            if(lastActiveStory !== collection.findWhere({active: true}).get('_id')){
              _this.refreshStories(collection);
              lastActiveStory = collection.findWhere({active: true}).get('_id');
            }              
          });
        },
        error: function(){
          console.log('Stories fetching error', arguments);
// 			    Chaplin.mediator.publish('loader:show');
        }
      });
    };
    
    Chaplin.mediator.unsubscribe('story:refresh');
    Chaplin.mediator.subscribe('story:refresh', function(collection){
      collection.fetch({
        success: function(collection){
			    _this.refreshStories(collection);
        }
      });
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
        container = container.html('<ul class="votes-list"></ul>').find('.votes-list');
        var template = require('views/desk/templates/vote');
        collection.each(function(item){
          container.append('<li class="vote">' + template({estimate: item.get('estimate')}) + '</li>');
        });
      };

      votesCollection.fetch({
        success: function(collection){
          var container = params.view.$el.find('.votes');
          console.log(collection.length)
          if(collection.length){
	          drawVotes(collection, container);
          }
          
          if(params.callback){
            params.callback(collection);
          }
          
          var poller = _.find(Application.pollers, function(item){
            return item == 'vote';
          });
          if(poller && poller.stop){
            poller.stop();
          }
          Application.pollers.push({name: 'vote', poller: votesPoller.get(collection, {delay: 5000}).start()});
          
          collection.on('sync', function(collection){
            if(collection.length){
              drawVotes(collection, container);
            }
          });
          
        },
        error: function(){
          if(params.callback){
            params.callback();
          }
					console.log('Error fetching votes', arguments);          
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
	    		Chaplin.mediator.publish('vote:refresh', {storyId: params.storyId, view: params.view, callback: callback});
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
