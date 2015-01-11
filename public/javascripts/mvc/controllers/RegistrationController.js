app.controller('RegistrationController',['$scope','UserService','$location','TeamService',function($scope,userService,$location,teamService){
    function init(){
       $scope.newUser={};
       $scope.registration={isNewTeamSelected:false};
       $scope.teams=[];
       teamService.getAllTeams().then(function(data){
           $scope.teams=data;
           $scope.teams.push({teamName:'Add new team'});
           
       })
    }
    init();
    var registerSuccessCallback=function(){
        $location.path('/login');
    }
    $scope.invokeRegister=function(){
        console.log('New user invoked');
        console.dir($scope.newUser);
        userService.createUser($scope.newUser).then(registerSuccessCallback);
    }
    $scope.checkAddNewTeamToggle=function(){
        if($scope.newUser.existingTeamName==='Add new team')
        {
        $scope.newUser.existingTeamName='';
        $scope.registration.isNewTeamSelected=true;
        }
        else
        {
             $scope.registration.isNewTeamSelected=false;
        }
    }
    
    $scope.togglePasswordField=function(){
        $scope.registration.checkPasswordToggle=!$scope.registration.checkPasswordToggle;
    }

  
}]);