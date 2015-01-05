/**
 * @name NewsFeedService
 * @desc This service provides CRUD functions for the news feed/comments section.Uses faye websocket library for the communication 
 */
app.service('NewsFeedService',['$http','$q','FayeClientFactory',function($http,$q,fayeClientFactory){
    this.subscribeToChannels=function(teamName,callback){
    fayeClientFactory.subscribe('/channel',callback);
        
    };
  /**
   * @name getPublicFeeds
   * @desc Gets all the feeds which the current user can see including the team private chat
   */
    this.getPublicFeeds = function(){
        
        var publicFeeds = [
            {poster:'Rahul Ravindran',post:'lauda',postTS:'0 minutes ago',teamName:'Bucanneers'},
            {poster:'Bimal Das',post:'chutiya',postTS:'1 minutes ago',teamName:'Gays'},
        {poster:'Abdul Jaleel',post:'maire',postTS:'2 minutes ago',teamName:'Privateers'},
        {poster:'Manish Lall',post:'bhosdke',postTS:'3 minutes ago',teamName:'Bucanneers'}
        ];
        
       return publicFeeds;
    };
    this.getTeamFeed = function(userid){
        
    };
    /**
   * @name getPublicFeeds
   * @desc Post a comment to the news feed
   */
    this.postNewMessage = function(newMessage){
        var url = 'https://treasurehunt-rahulravindran27091.c9.io/message';
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