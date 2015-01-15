window.angular.module('TreasureHunt').directive('spinner', function() {
  return {
    restrict: 'AE',
    replace: false,
    transclude:true,
    scope:{spinnerHidden:'='},
    templateUrl: 'partials/spinner.tmpl.html',
    link: function(scope, elem, attrs) {
    }
  };
});