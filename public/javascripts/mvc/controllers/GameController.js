app.controller('GameController',['$scope','TeamService',function($scope,teamService){
    function init(){
        $scope.currentClue={passcode:''};
        $scope.currentUser={username:'r',teamName:'Bucaneers'};
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