
(function(){
var app=window.angular.module('scrollerModule',[]);
app.directive('scroller',['$timeout',function($timeout){
    var linkFn=function(scope,elem,attrs){
        scope.scrollDirection=attrs.scroller;
        var scrollEventHandler=function(){
            console.log('Scrolling'+elem[0].scrollHeight);
            $timeout(function(){
                elem.scrollTop(elem[0].scrollHeight);
            },0);
            
        };
        scope.$on('scroll-event',scrollEventHandler);
        
    };
    return {
        scope:{},
        link:linkFn,
        replace:false
    }
}]);
})();