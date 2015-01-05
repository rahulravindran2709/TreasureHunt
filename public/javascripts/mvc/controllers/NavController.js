app.controller('NavController',['$scope',function($scope,newsFeedService){
    function init(){
        $scope.isAuthenticated=false;
    }
    init();
}])