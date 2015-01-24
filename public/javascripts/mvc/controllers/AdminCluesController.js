(function (){
    window.angular.module('TreasureHunt').controller('AdminCluesController',['$scope','CluesService',function AdminCluesController($scope,cluesService){
        
        var populateClues = function(clues){
            $scope.clues=angular.forEach(clues,function(clue){
                var newClue = angular.copy(clue);
                newClue.isEditable=false;
                return newClue;
                
            });
        }
        var saveSucesss=function(data){
            delete this.clue.isNew;
        }
        function init(){
            $scope.newClue={};
            cluesService.getAllClues().then(populateClues);
        }
        init();
        $scope.addClue=function(){
            var newClueObject=window.angular.copy($scope.newClue);
            newClueObject.isNew=true;
            newClueObject.isEditable=true;
            $scope.clues.push(newClueObject);
        }
        $scope.editClue=function(clue){
            clue.isEditable=true;
        }
        $scope.removeClue=function(clue){
            $scope.clues.splice($scope.clues.indexOf(clue),1);
        }
        /***
         * @name saveClue
         * @desc THis single method will either save a new clue to the server 
         * or update an existing one
         * 
         * 
         * 
         */ 
        $scope.saveClue=function(clue){
            if(clue&&clue.isNew){
                cluesService.addClue(clue).then(saveSucesss.bind({clue:clue}));
            }
            else
            {
                cluesService.updateClue(clue).then(saveSucesss.bind({clue:clue}));
            }
        }
        
    }]);
})();