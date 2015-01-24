(function(){
    window.angular.module('TreasureHunt').directive('fileHandler',['$parse',function fileHandlerDirective($parse){
        
        var linkFn=function(scope,elem,attrs){
            elem.bind('change',function(){
                console.log('File uploaded'+elem[0].files[0]);
                $parse(attrs.fileHandler).assign(scope,elem[0].files[0]);
                scope.$apply();
            });
        }
        
        return {
            restrict:'A',
            link:linkFn
        }
        
    }]);
    
})();