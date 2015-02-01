(function (angular){
    window.angular.module('TreasureHunt').controller('AdminCluesController',['$scope','CluesService',function AdminCluesController($scope,cluesService){
        
        var populateClues = function(clues){
            $scope.clues=angular.forEach(clues,function(clue){
                var newClue = angular.copy(clue);
                newClue.isEditable=false;
                newClue.passcode=clue.passCode;
                return newClue;
                
            });
        }
        var saveSucesss=function(data){
            delete this.clue.isNew;
            this.clue.isEditable=false;
            this.clue.map_img=this.clue.map_img.name;
            this.clue.clue_img=this.clue.clue_img.name;
            console.log('File structure'+angular.toJson(this.clue.map_img));
            console.log('File upload complete');
        }
        function init(){
            $scope.newClue={};
            $scope.modalOptions={isModalHidden:true};
            $scope.deletedClue={};
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
            console.log('delete called'+ angular.toJson($scope.modalOptions));
            $scope.modalOptions={isModalHidden:false};
            $scope.deletedClue=clue;
            //$scope.clues.splice($scope.clues.indexOf(clue),1);
        }
        $scope.confirmDelete=function(clue){
            console.log('Confirm called'+angular.toJson(clue)+' index of '+$scope.clues.indexOf(clue));
            var removeClueFromList=function(){
                console.log('Length of removeClueFromList'+$scope.clues.length);
                 $scope.clues.splice($scope.clues.indexOf(clue),1);
                 console.log('Length of clues'+$scope.clues.length);
            };
            cluesService.deleteClue(clue._id).then(removeClueFromList,function(){
                console.log('Error occured');
            });
            
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
})(window.angular);