/***
 * @name UserService
 * @desc This service type handles all CRUD operations pertaining to user entity
 * 
 * 
 */ 

window.angular.module('TreasureHunt').service('UserService',['$http','$q','apiURLConstants',function($http,$q,apiURLConstants){
    this.getUsers = function(){
        
        var deferred=$q.defer();
        $http.get(apiURLConstants.GET_ALL_USERS_URL).then(
            function(response){
                deferred.resolve(response.data);
            }
            );
       return deferred.promise;
    };
    this.updateUser = function(userDetails){
        var deferred= $q.defer();
        //TODO MAke this a http call
        self.setTimeout(function(){
            console.log('Herer');
            deferred.resolve(userDetails);
        },1000);
        
        return deferred.promise;
    }
    this.getUserByUsername=function(name){
        return $http.get(apiURLConstants.GET_ALL_USERS_URL+name+apiURLConstants.USER_ADD_URL_SUFFIX);
    }
    this.createUser=function(user){
        return $http.post(apiURLConstants.GET_ALL_USERS_URL,user);
    }
}]);