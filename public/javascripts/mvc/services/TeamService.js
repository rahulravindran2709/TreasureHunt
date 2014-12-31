app.service('TeamService',['$http','$q',function($http,$q){
    console.log('In team service');
    this.getAllTeams = function(){
        
        var teams = ['Bucanneers','Gays','Pirates'];       
        var deferred=$q.defer();
        deferred.resolve(teams);
       return deferred.promise;
    };
}]);