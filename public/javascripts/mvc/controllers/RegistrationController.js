/**
 * @name RegistrationController
 * @desc This controller will take care of the registration process of
 * a new player
 * 
 * 
 * 
 * 
 * 
 */ 
window.angular.module('TreasureHunt').controller('RegistrationController',['$scope','UserService','$location','TeamService',function($scope,userService,$location,teamService){
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
    var registerSuccessCallback=function(response){
        console.log('In succcess callback');
        $location.path('/login');
    }
    var registerFailureCallback=function(){
        console.log('Error in registering the user');
    }
    $scope.invokeRegister=function(){
        console.log('New user invoked');
        
        var userObj={};
        userObj=angular.copy($scope.newUser);
        if($scope.registration.isNewTeamSelected)
        {
            
            userObj.teamName=$scope.newUser.newTeamName;
            userObj.existingTeamName=undefined;
        }
        else{
            userObj.teamName=$scope.newUser.existingTeamName;
            userObj.newTeamName=undefined;
            
        }
        console.dir(userObj);
        userService.createUser(userObj).then(registerSuccessCallback);
    }
    $scope.checkAddNewTeamToggle=function(){
        if($scope.newUser.existingTeamName==='Add new team')
        {
        $scope.newUser.existingTeamName='';
        $scope.registration.isNewTeamSelected=true;
        }
        else
        {
            $scope.newUser.newTeamName='';
             $scope.registration.isNewTeamSelected=false;
        }
    }
    
    $scope.togglePasswordField=function(){
        $scope.registration.checkPasswordToggle=!$scope.registration.checkPasswordToggle;
    }

  
}]);