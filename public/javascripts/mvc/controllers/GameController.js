window.angular.module('TreasureHunt').controller('GameController',['$scope','TeamService','Credentials',function($scope,teamService,credentials){
    function init(){
        var userData=credentials.getCurrentUser();
        userData=userData.data;
        $scope.currentUser={username:userData.username,teamName:userData.teamName,steps:userData.stepsRemaining}
        console.log('Value of credentials in game page'+angular.toJson(userData));
        teamService.getClueForTeam($scope.currentUser.teamName).then(getClueForTeamSuccessCallback,getClueErrorCallback);
    }
    init();
    var getClueErrorCallback=function(error){
        console.log('Error occcured while getting clues for team');
    }
    var getClueForTeamSuccessCallback=function(data){
        console.log('Value of latest clue is '+angular.toJson(data));
        $scope.currentClue=data;
    }
  $scope.solveClue=function(){
      
      teamService.solveClueByTeam($scope.currentUser.teamName,$scope.passcode).then(teamService.getClueForTeam($scope.currentUser.teamName),getClueErrorCallback).then(getClueForTeamSuccessCallback,getClueErrorCallback);
  }
  
}]);