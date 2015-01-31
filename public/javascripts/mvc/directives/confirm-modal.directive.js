(function(angular){
    
    angular.module('TreasureHunt').directive('confirmModal',function confirmModal(){
        
        var linkFn=function(scope,elem,attrs){
            
            scope.$watch(
                function(){
                return scope.showToggle},function(newVal){
                console.log('Watch called'+newVal);
                if(newVal===true)
                {
                elem.modal('hide'); 
                }
                else if(newVal===false)
                {
                    elem.modal('show');  
                }
            });
            elem.find('.confirm-button').bind('click',function(){
                
                scope.$apply(function(){
                    scope.showToggle=true;
                    
                });
                console.log('value recieved by confirm'+angular.toJson(scope.data));
                scope.confirmCall({data:scope.data});
            });
            elem.find('.close').bind('click',function(){
                scope.$apply(function(){
                    scope.showToggle=true;
                });
            });
            elem.find('.deny-button').bind('click',function(){
                scope.$apply(function(){
                    scope.showToggle=true;
                    
                });
                scope.rejectCall({data:scope.data});
                
            });
        }
        
        
        return {
            restrict:'E',
            replace:true,
            scope:{
                modalHeader:'@',
                showToggle:'=',
                confirmCall:'&',
                rejectCall:'&',
                data:'='
            },
            templateUrl:'partials/confirm-modal.tmpl.html',
            link:linkFn
        }
        
    })
})(window.angular);