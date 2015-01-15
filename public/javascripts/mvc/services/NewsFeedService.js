/**
 * @name NewsFeedService
 * @desc This service provides CRUD functions for the news feed/comments section.Uses faye websocket library for the communication 
 */
window.angular.module('TreasureHunt').service('NewsFeedService',['$http','$q','FayeClientFactory','apiURLConstants',function($http,$q,fayeClientFactory,apiURLConstants){
    this.subscribeToChannels=function(teamName,callback){
    fayeClientFactory.subscribe(teamName,callback);
        
    };
  /**
   * @name getPublicFeeds
   * @desc Gets all the feeds which the current user can see including the team private chat
   */
    this.getPublicFeeds = function(username){
        var deferred=$q.defer();
        $http.get(apiURLConstants.GET_ALL_USERS_URL+username+apiURLConstants.USER_CHAT_URL_SUFFIX).then(function(response){
            deferred.resolve(response.data)
        },function(error){
            deferred.reject([]);
        })
       return deferred.promise;
    };
    this.getTeamFeed = function(userid){
        
    };
    /**
   * @name getPublicFeeds
   * @desc Post a comment to the news feed
   */
    this.postNewMessage = function(newMessage){
        var url = 'http://treasurehunt-rahulravindran27091.c9.io/api/users/'+newMessage.poster+'/chat';
        console.log('Click happened');
        var message = {message: newMessage};
        var ajaxPromise = $q.defer();
        var dataType = 'json';
        $.ajax({
            type: 'POST',
            url: url,
            data: message,
            dataType: dataType,
            success:function(data){
              ajaxPromise.resolve(data);  
            },
            error:function(error){
                console.log('Error in ajax'+angular.toJson(error));
                ajaxPromise.reject(error);
            }
        });
        return ajaxPromise.promise;
    }
}]);