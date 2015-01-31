/***
 * @name CluesService
 * @desc Provides a CRUD service for adminstration of clues required in the game
 * 
 * 
 * 
 * 
 */ 

(function(angular){
    window.angular.module('TreasureHunt').service('CluesService',['$http','$q','apiURLConstants',function CluesService($http,$q,apiURLConstants){
        
        this.getAllClues=function(){
            var deferred = $q.defer();
            $http.get(apiURLConstants.GET_ALL_CLUES).then(function(response){
                deferred.resolve(response.data)
            },function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        }
        this.deleteClue=function(clue){
            var deferred = $q.defer();
            $http.delete(apiURLConstants.GET_ALL_CLUES+clue).then(function(response){
                
                deferred.resolve(response.data);
            },function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        }
        this.addClue=function(clue){
            console.log('In add clue');
            var deferred = $q.defer();
            var data={clue:clue};
            var fd = new FormData();
            fd.append('name',clue.name);
            fd.append('order',clue.order);
            fd.append('map_img',clue.map_img);
            fd.append('clue_img',clue.clue_img);
            fd.append('passCode',clue.passcode);
            var options={transformRequest:angular.identity,
                headers:{'Content-Type':undefined}};
            $http.post(apiURLConstants.GET_ALL_CLUES,fd,options).then(function sucessCallback(response) {
                deferred.resolve(response.data);
            },function errorCallback(error) {
               deferred.reject(error);
            });
            return deferred.promise;
        }
        this.updateClue=function(clue){
            var deferred = $q.defer();
            var data={clue:clue};
            $http.put(apiURLConstants.GET_ALL_CLUES,data).then(function sucessCallback(response) {
                deferred.resolve(response.data);
            },function errorCallback(error) {
               deferred.reject(error);
            });
            return deferred.promise;
        }
        
    }]);
})(window.angular);