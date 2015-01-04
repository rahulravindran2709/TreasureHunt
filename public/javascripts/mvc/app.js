var app=angular.module('TreasureHunt',['ngRoute','ngAnimate','angularSimpleAuth']);
app.constant('faye',Faye);

app.config(['$routeProvider','$locationProvider',
  function($routeProvider,$locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/landing.tmpl.html',
        controller: 'HomeController'
      }).
      when('/leaderboard', {
        templateUrl: 'partials/leaderboard-content.tmpl.html',
        controller: 'HomeController'
      }).
      otherwise({
        redirectTo: '/'
      });
      
      // use the HTML5 History API
        //$locationProvider.html5Mode(true);
  }]);