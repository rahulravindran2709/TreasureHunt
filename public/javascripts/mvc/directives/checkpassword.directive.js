app.directive('checkPassword', function() {
  return {
    restrict: 'A',
    scope:{showPassword:'='},
    replace:true,
    link: function(scope, elem, attrs) {
        elem.attr('type','password');
        //scope.fieldType='password';
        scope.$watch(function(scope){
            console.log('In check password'+scope.showPassword);
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