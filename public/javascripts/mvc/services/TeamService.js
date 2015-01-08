app.service('TeamService',['$http','$q',function($http,$q){
    console.log('In team service');
    this.getAllTeams = function(){
        
        var teams = [   {teamName:'Bucanneers',cluesSolved:3},
                        {teamName:'Gays',cluesSolved:4},
                        {teamName:'Pirates',cluesSolved:5}];       
        var deferred=$q.defer();
        deferred.resolve(teams);
       return deferred.promise;
    };
    this.getClueForTeam=function(teamName){
        return $http.get('/api/team'+teamName+'/game')
    }
    this.solveClueByTeam=function(teamName){
        return $http.put('/api/team'+teamName+'/game')
    }
    this.getClueSolveTimes=function(){
        var deferred=$q.defer();
        var data = { labels: ['Step1', 'Step2', 'Step3', 'Step4', 'Step5', 'Step6'],
                      series: [
                      {
                          name: 'Fibonacci sequence1',
                          data: [5, 4, 6.5, 4, 5, 7]
                        }
                        ,
                        {
                          name: 'Fibonacci sequence2',
                          data: [3, 2, 9, 5, 4, 6]
                        }
                        ,
                        {
                          name: 'Fibonacci sequence3',
                          data: [2, 1.5, 3, 4, 2, 2]
                        }
                        
                      ]
                    };
        deferred.resolve(data);            
        return deferred.promise;
    }
}]);