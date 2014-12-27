app.controller('NewsFeedController',['$scope','NewsFeedService',function($scope,newsFeedService){
    console.log('In controller');
    $scope.publicFeeds = newsFeedService.getPublicFeeds();
    $scope.postNewMessage = function(){
        $scope.newMessage.postTS = 'Just Now';
        $scope.newMessage.poster = 'Rahul';
        $scope.newMessage.teamName = 'Bucanneers';
        $scope.publicFeeds.push($scope.newMessage);
        $scope.newMessage.post='';
    }
}])