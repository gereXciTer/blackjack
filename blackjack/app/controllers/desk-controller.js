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
var excelExport = require('lib/export');

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
var UsersOnline = require('models/users-online');

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
          if(lastActiveStory !== (collection.findWhere({active: true}) ? collection.findWhere({active: true}).get('_id') : '-1')){
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
          lastActiveStory = collection.findWhere({active: true}) ? collection.findWhere({active: true}).get('_id') : '-1';
          lastRevealedStoryId = lastRevealedStory ? lastRevealedStory.get('_id') : false;
        }
      });

			storyCollection.fetch({
        success: function(collection){
          _this.refreshStories(collection);
        }
      });

    };
    
    var usersOnline = new UsersOnline();
    Chaplin.mediator.unsubscribe('online:parse');
    Chaplin.mediator.subscribe('online:parse', function(){
      usersOnline = new UsersOnline({deskId: params.id});
      
      var poller = _.find(Application.pollers, function(item){
        return item.name == 'online';
      });
      if(poller && poller.poller.stop){
        poller.poller.stop();
        poller.poller.start();
      }else{
        Application.pollers.push({name: 'online', poller: storiesPoller.get(usersOnline, {delay: Application.pollerConfig.getFreq('online')}).start()});
      }
      
      usersOnline.on('sync', function(){
       	var users = $('.participants li[data-id]');
        users.each(function(index, el){
          el = $(el);
					var found = usersOnline.find(function(item){
            return item.get(el.data('id'));
          });
          if(found){
            el.addClass('online');
          }else{
            el.removeClass('online');
          }
        });
      });
    });

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
        
    var votesCollection = new VotesCollection();
    Chaplin.mediator.unsubscribe('vote:refresh');
    Chaplin.mediator.subscribe('vote:refresh', function(params){
      
      votesCollection.options.storyId = params.storyId;
			
      var drawVotes = function(collection){
        var container = $('.story .votes');
        var isRevealed = container.data('revealed') || false;
        container = container.html('<ul class="votes-list"></ul>').find('.votes-list');
        var template = require('views/desk/templates/vote');
        var average = 0;
        var averageVal = 0;
        var estimates = {};
        collection.each(function(item){
          estimates[item.get('estimate')] = estimates[item.get('estimate')] ? estimates[item.get('estimate')] + 1 : 1;
        });
        for(var i in estimates){
        	if(averageVal < estimates[i]){
            averageVal = estimates[i];
            average = i;
          }
        }
        collection.each(function(item){
          var name = _.find(Application.desk.participant, function(user){
            return user.email == item.get('email');
          }).name;
          container.append('<li class="vote' + (isRevealed && (item.get('estimate') !== average) ? ' notaverage' : '') + '">' + 
                           template(_.extend(item.getAttributes(), {isRevealed: isRevealed, name: name})) + 
                           '</li> ');          
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
      votesCollection.off('sync', drawVotes).on('sync', drawVotes);

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
    this.view.subview('stories', storiesCollectionView);
    Chaplin.mediator.publish('loader:hide');
  }
  
});
