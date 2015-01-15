/**
 *  @name LeaderboardController
 *  @desc Handles all functionality in leaderbaord screen like retrieving current standings and some analytics
 * 
 * 
 */ 
window.angular.module('TreasureHunt').controller('LeaderboardController',['$scope','TeamService',function($scope,teamService){
    var getTeamScores=function(){
        teamService.getAllTeams().then(function(data){
            $scope.teamscores=data;
        });
    }
    var getSolveTimes=function(){
        teamService.getClueSolveTimes().then(function(data){
            $scope.solveTimes=data;
        });
    }
    function init(){
    getTeamScores();
    getSolveTimes();
    $scope.options= {
                      showPoint: true,
                      lineSmooth: false,
                      axisX: {
                        showGrid: false,
                        showLabel: true
                      },
                      axisY: {
                        offset: 40,
                        labelInterpolationFnc: function(value) {
                          return value + ' hr';
                        }
                      }
                    };

    }
    init();
    
}])