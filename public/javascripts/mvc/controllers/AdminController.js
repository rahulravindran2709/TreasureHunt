app.controller('AdminController',['$scope','UserService','TeamService','$timeout',function($scope,userService,teamService,$timeout){
    console.log('In admin controller');
    $scope.isHidden=true;
    function hideNotification(){
        $scope.showToast=false;
    }
    function switchView(userDetails){
        userDetails.isSpinnerHidden=true;
        showNotification('You have successfully assigned '+userDetails.userName+' to team '+userDetails.teamName);
        $timeout(hideNotification,1500,true);
        if(userDetails.approvalStatus=="Pending")
        {
        userDetails.approvalStatus="Approved";
        }
    }
    function showNotification(message){
        $scope.showToast=true;
        $scope.toastMessage=message;
        
    }
    function populateTeamList(teamList){
        $scope.teamList=teamList;
    }
    function populateUserList(users){
            $scope.requests=[];
            /*Not efficient but couldnt think of anythin else*/
            angular.forEach(users, function(value) {
            value.isSpinnerHidden=true;
            this.push(value);
            },$scope.requests);
        }
    function init(){
        hideNotification();
         userService.getUsers().then(populateUserList);
         teamService.getAllTeams().then(populateTeamList);
    }
    init();
    $scope.approveUserRequest = function(request){
        request.isSpinnerHidden=false;
        userService.updateUser(request).then(switchView);
    }
    $scope.changeUserTeamDetails = function(userDetails){
        userService.updateUser(userDetails).then(switchView);
    }
}])