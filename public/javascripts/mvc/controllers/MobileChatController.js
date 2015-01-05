app.controller('MobileChatController',['$scope',function($scope,newsFeedService){
    function init(){
        $scope.showChat=false;
    }
    init();
    $scope.toggleChatOverlay=function(){
        $scope.showChat = !$scope.showChat;
        
    }
}])