(function(){
    
    window.angular.module('TreasureHunt').controller('CluesController',['$scope','Credentials','TeamService',function($scope,credentials,teamService){
        var populateCluesToScope=function(data){
            $scope.clues=data;
        }
        var getSolvedCluesForAccordion=function(teamName){
            teamService.getSolvedClues(teamName).then(function(data){
                populateCluesToScope(data);
            });
            
        }
        var init =function(){
        var userData=credentials.getCurrentUser();
        userData=userData.data;
        console.log('Value of credentials in clues page'+angular.toJson(userData));
        $scope.user={username:userData.fullName,teamName:userData.teamName,steps:userData.stepsRemaining};
        getSolvedCluesForAccordion($scope.user.teamName);    
        };
        init();
        
    }]);
    
    
})();
