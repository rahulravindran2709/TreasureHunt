app.controller('MobileChatController',['$scope',function($scope,newsFeedService){
    console.log('In controller');
    
    function init(){
        $scope.showChat=false;
    }
    init();
    $scope.toggleChatOverlay=function(){
        $scope.showChat = !$scope.showChat;
        
    }
}])