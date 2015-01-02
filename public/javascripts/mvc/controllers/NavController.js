app.controller('NavController',['$scope',function($scope,newsFeedService){
    console.log('In  nav controller');
    
    function init(){
        $scope.isAuthenticated=false;
    }
    init();
}])