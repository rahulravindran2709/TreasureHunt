window.angular.module('TreasureHunt').controller('MobileChatController',['$scope','$animate','$q',function($scope,$animate,$q){
    function init(){
        $scope.showChat=false;
        $scope.unreadCount=0;
    }
    init();
    $scope.toggleChatOverlay=function(){
        $scope.showChat = !$scope.showChat;
        
    }
    var scrollMessages = function(){
        $scope.$broadcast('scroll-event');
    }
    var incrementUnreadCount = function(){
        var deferred = $q.defer();
        $scope.unreadCount=$scope.unreadCount+1;
        deferred.resolve();
        return deferred.promise;
        
    }
    var handleNewMessageNotification = function(){
        incrementUnreadCount().then(function(){scrollMessages()});
        
    }
    $scope.$on('new-message',handleNewMessageNotification);
}])