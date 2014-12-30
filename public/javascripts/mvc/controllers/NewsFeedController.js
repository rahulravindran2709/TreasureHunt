app.controller('NewsFeedController',['$scope','NewsFeedService',function($scope,newsFeedService){
    console.log('In controller');
    
    function init(){
        $scope.publicFeeds = newsFeedService.getPublicFeeds();
        newsFeedService.subscribeToChannels('Team1',function(message){
            console.log('Adding one comment'+angular.toJson(message.text));
            $scope.$apply(function(){
                $scope.publicFeeds.push(angular.fromJson(message.text));
            });
        
        });
    }
    init();
    $scope.postNewMessage = function(){
        var newMessage ={};
        newMessage.postTS = 'Just Now';
        newMessage.poster = 'Rahul';
        newMessage.teamName = 'Bucanneers';
        newMessage.post = $scope.newMessage.post;
        newsFeedService.postNewMessage(newMessage).then(function(){
            $scope.newMessage.post='';
        });
        
        
    }
}])