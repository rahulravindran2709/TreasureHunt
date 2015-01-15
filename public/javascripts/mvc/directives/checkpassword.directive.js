window.angular.module('TreasureHunt').directive('checkPassword', function() {
  return {
    restrict: 'A',
    scope:{showPassword:'='},
    replace:true,
    link: function(scope, elem, attrs) {
        elem.attr('type','password');
        //scope.fieldType='password';
        scope.$watch(function(scope){
            return scope.showPassword;
        },function(newVal){
            if(newVal)
            {
                elem.attr('type','text');
            }
            else
            {
                elem.attr('type','password');
            }
        });
    }
  };
});