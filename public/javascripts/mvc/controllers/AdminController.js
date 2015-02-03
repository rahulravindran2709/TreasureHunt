
(function(angular){
/**
 * @name AdminController
 * @desc This serves as the controller for the admin landing page
 */
angular.module('TreasureHunt').controller('AdminController',['$scope','UserService','TeamService','$timeout',function($scope,userService,teamService,$timeout){
    $scope.isHidden=true;
    /**
   * @name init
   * @desc Initialises the controller and makes necessary service calls
   * to provide a initial view state
   */
    function init(){
        hideNotification();
         userService.getUsers().then(populateUserList);
         teamService.getAllTeams().then(populateTeamList);
    }
    init();
      /**
       * @name approveUserRequest
       * @desc This function is a click event handler for the approve
       *  request button for each user
       * @param {Object} request - User request object where the event handler was invoked
       */
    $scope.approveUserRequest = function(request){
        request.isSpinnerHidden=false;
        userService.updateUser(request).then(switchView);
    }
      /**
       * @name changeUserTeamDetails
       * @desc This function is a change event handler for the team name
       * drop down.This will trigger a updateuser service call to change the team details 
       * for that user
       * @param {Object} userDetails - User request object where the event handler was invoked
       */
    $scope.changeUserTeamDetails = function(userDetails){
        userService.updateUser(userDetails).then(switchView);
    }
      /**
       * @name hideNotification
       * @desc This private function is used to hide the success notification once the update of user details
       * is complete for a user
       */
    function hideNotification(){
        $scope.showToast=false;
    }
      /**
       * @name showNotification
       * @desc This private function is show the success notification once the update of user details
       * and toggles on/off the toast notification
       */
    function showNotification(message){
        $scope.showToast=true;
        $scope.toastMessage=message;
        
    }
      /**
       * @name switchView
       * @desc This private function is the callback for a successful update user call and disables the ajax spinner
       * and toggles on/off the toast notification
       */
    function switchView(userDetails){
        userDetails.isSpinnerHidden=true;
        showNotification('You have successfully assigned '+userDetails.fullName+' to team '+userDetails.team.teamName);
       /* $timeout(hideNotification,1500,true);*/
        if(userDetails.approvalStatus=="Pending")
        {
        userDetails.approvalStatus="Approved";
        }
    }
      /**
       * @name populateTeamList
       * @desc This private function is the callback for a successful get all teams call and set the teamslist to the scope
       * and toggles on/off the toast notification
       */
    function populateTeamList(teamList){
        $scope.teamList=[];
        angular.forEach(teamList,function(elem){
            this.push(elem.teamName);
        },$scope.teamList);
    }
    /**
       * @name populateUserList
       * @desc This private function is the callback for a successful get users call and sets the userslist to the scope
       * and toggles on/off the toast notification
       */
    function populateUserList(users){
            $scope.requests=[];
            /*Not efficient but couldnt think of anythin else ;)*/
            angular.forEach(users, function(value) {
            value.isSpinnerHidden=true;
            this.push(value);
            },$scope.requests);
        }
    
}])

})(window.angular);