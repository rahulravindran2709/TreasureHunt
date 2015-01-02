app.controller('HomeController',['$scope',function($scope){
    console.log('In home controller');
    
    function init(){
        $scope.user={userName:'Rahul',teamName:'Bucaneers',steps:2};
        $scope.isClueHidden=false;
        $scope.totalSteps=6;
        $scope.user.progress=($scope.totalSteps-$scope.user.steps)*(100/6)+'%';
    }
    init();
    $scope.toggleCluesSection=function(){
         $scope.isClueHidden=!$scope.isClueHidden;
    } 
  
}]);