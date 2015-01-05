app.service('UserService',['$http','$q',function($http,$q){
    console.log('In user service');
    this.getUsers = function(){
        
        var users = [{userName:'Rahul',teamName:'Bucanneers',approvalStatus:'Pending'},
            {userName:'Bimal',teamName:'Gays',approvalStatus:'Pending'},
            {userName:'Manish',teamName:'Pirates',approvalStatus:'Pending'}];
        var deferred=$q.defer();
        deferred.resolve(users);
       return deferred.promise;
    };
    this.updateUser = function(userDetails){
        var deferred= $q.defer();
        self.setTimeout(function(){
            console.log('Herer');
            deferred.resolve(userDetails);
        },1000);
        
        return deferred.promise;
    }
    this.getUserByUsername=function(name){
        return $http.get('/api/users/'+name+'/show');
    }
}]);