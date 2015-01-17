

(function(){
var app=window.angular.module('AnimationModule',[]);
app.directive('toggleAnimation',function ToggleAnimation(){
    
    
    var linkFn = function(scope,elem,attrs){
        console.log('In link of toggle animation');
        scope.$watch(
            function(){
                return scope.watchThis;
            },function(newVal){
                console.log('VAlue changed');
                if(elem.hasClass('unread-message'))
                {
                     console.log('has already the class');
                     elem.removeClass('unread-message');
                }
                if(newVal>0)
                {
                    elem.addClass('unread-message');
                }
                
            }
            
            );
        
        
    }
    
    return {
        scope:{watchThis:'='},
        replace:false,
        link:linkFn
    }
    
});
})();