/**
 * @name TeamService
 * @desc All CRUD services related to team based data
 * 
 * 
 * 
 */ 
window.angular.module('TreasureHunt').service('TeamService',['$http','$q','apiURLConstants',function($http,$q,apiURLConstants){
    /**
     * @name getAllTeams
     * 
     * 
     */ 
    this.getAllTeams = function(){
        
        var teams = [   {teamName:'Bucanneers',cluesSolved:3},
                        {teamName:'Gays',cluesSolved:4},
                        {teamName:'Pirates',cluesSolved:5}]; 
                        
         var deferred=$q.defer();               
        $http.get(apiURLConstants.GET_ALL_TEAMS_URL).then(function(response){
            teams=response.data;
            deferred.resolve(teams);
        },function(error){
            deferred.reject(error);
        });                
        
        
       return deferred.promise;
    };
    this.getClueForTeam=function(teamName){
        return $http.get(apiURLConstants.GET_ALL_TEAMS_URL+teamName+apiURLConstants.TEAMS_CLUE_SUFFIX)
    }
    /**
     * @name getSolvedClues
     * @desc This method will get all the solved clues by a given team
     * 
     * 
     * 
     */ 
    this.getSolvedClues=function(teamName){
            var deferred = $q.defer();
            $http.get(apiURLConstants.GET_ALL_TEAMS_URL+teamName+apiURLConstants.TEAMS_CLUE_SUFFIX).then(function(response){
                deferred.resolve(response.data);
            },function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        };
    this.solveClueByTeam=function(teamName){
        return $http.put('/api/team'+teamName+'/game')
    }
    this.getClueSolveTimes=function(){
        var deferred=$q.defer();
        var data = { labels: ['Step1', 'Step2', 'Step3', 'Step4', 'Step5', 'Step6'],
                      series: [
                      {
                          name: 'Team1',
                          data: [5, 4, 6.5, 4, 5, 7]
                        }
                        ,
                        {
                          name: 'Team2',
                          data: [3, 2, 9, 5, 4, 6]
                        }
                        ,
                        {
                          name: 'Team3',
                          data: [2, 1.5, 3, 4, 2, 2]
                        }
                        
                      ]
                    };
        deferred.resolve(data);            
        return deferred.promise;
    }
}]);