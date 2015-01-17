/**
 * @name NewsFeedController
 * @desc This class maintains scope binding for the parts of the page responsible for the
 *       chat functionality
 * 
 * 
 */
window.angular.module('TreasureHunt').controller('NewsFeedController',['$scope','$filter','NewsFeedService','Credentials','apiURLConstants',function($scope,$filter,newsFeedService,credentials,apiURLConstants){
    function init(){
        $scope.currentChat="PublicChat";
        var userData=credentials.getCurrentUser();
        userData=userData.data;
        $scope.user={username:userData.fullName,teamName:userData.teamName,email:userData.email};
        newsFeedService.getPublicFeeds($scope.user.email).then(function(data){
            $scope.publicFeeds = $filter('filter')(data,{type:'public'});
            $scope.privateFeeds = $filter('filter')(data,{type:'team'});
        });
        /*TODO This team channel is created just by appending the teamname in plain text.Might want to make it more secure and unaccesible to other teams 
        just by changing teamnames*/
        var teamChannel="/"+$scope.user.teamName;
        console.log('team'+teamChannel);
        newsFeedService.subscribeToChannels(teamChannel,function(message){
            console.log('Adding one comment team chat'+angular.toJson(message.text));
            $scope.$emit('new-message');
            $scope.$apply(function(){
                $scope.privateFeeds.push(angular.fromJson(message.text));
            });
        
        });
        var publicChannel=apiURLConstants.PUBLIC_MESSAGING_URL;
        newsFeedService.subscribeToChannels(publicChannel,function(message){
            console.log('Adding one comment public chat'+angular.toJson(message.text));
            $scope.$emit('new-message');
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
        newMessage.poster = $scope.user.email;
        newMessage.teamName = $scope.user.teamName;
        newMessage.post = $scope.newMessage.post;
        newMessage.type=$scope.currentChat;
        console.log('Value of current message'+angular.toJson(newMessage));
        newsFeedService.postNewMessage(newMessage).then(function(){
            $scope.newMessage.post='';
        });
        
        
    }
}])