/**
 * @name NewsFeedController
 * @desc This class maintains scope binding for the parts of the page responsible for the
 *       chat functionality
 * 
 * 
 */
app.controller('NewsFeedController',['$scope','$filter','NewsFeedService','Credentials',function($scope,$filter,newsFeedService,credentials){
    function init(){
        $scope.currentChat="PublicChat";
        $scope.publicFeeds = $filter('filter')(newsFeedService.getPublicFeeds(),{isPrivate:false});
        $scope.privateFeeds = $filter('filter')(newsFeedService.getPublicFeeds(),{isPrivate:true});
        newsFeedService.subscribeToChannels('Team1',function(message){
            console.log('Adding one comment'+angular.toJson(message.text));
            $scope.$apply(function(){
                $scope.privateFeeds.push(angular.fromJson(message.text));
            });
        
        });
        newsFeedService.subscribeToChannels('public',function(message){
            console.log('Adding one comment'+angular.toJson(message.text));
            $scope.$apply(function(){
                $scope.publicFeeds.push(angular.fromJson(message.text));
            });
        
        });
    }
    init();
    $scope.setCurrentTab = function(value){
        $scope.currentChat=value;
    }
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