/**
 * @name HomeController
 * @desc This controller handles the scope for the landing page
 * 
 * 
 */ 
window.angular.module('TreasureHunt').controller('HomeController',['$scope','$location','routeConstants','Credentials',function($scope,$location,routeConstants,credentials){
    function init(){
        
        var userData=credentials.getCurrentUser();
        userData=userData.data;
        console.log('Value of credentials in home page'+angular.toJson(userData));
        $scope.user={username:userData.fullName,teamName:userData.teamName,steps:userData.stepsRemaining}
        $scope.isClueHidden=false;
        $scope.totalSteps=userData.stepsTotal;
        $scope.user.progress=($scope.totalSteps-$scope.user.steps)*(100/$scope.totalSteps)+'%';
    }
    init();
    $scope.toggleCluesSection=function(){
         $scope.isClueHidden=!$scope.isClueHidden;
    } 
    $scope.goToGame=function(){
        $location.path(routeConstants.GAME_URL);
    }
  
}]);