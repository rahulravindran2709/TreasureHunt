app.controller('RegistrationController',['$scope','UserService','$location',function($scope,userService,$location){
    function init(){
       $scope.newUser={};
    }
    init();
    var registerSuccessCallback=function(){
        $location.path('/login');
    }
    $scope.invokeRegister=function(){
        userService.createUser($scope.newUser).then(registerSuccessCallback);
    }
  
}]);