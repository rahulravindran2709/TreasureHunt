var app=angular.module('TreasureHunt',['ngRoute','ngAnimate','angularSimpleAuth']);
app.constant('faye',Faye);

app.config(['$routeProvider','$locationProvider',
  function($routeProvider,$locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/landing.tmpl.html',
        controller: 'HomeController'
      }).when('/login',{
        templateUrl: 'partials/login.tmpl.html',
      })
      .
      when('/leaderboard', {
        templateUrl: 'partials/leaderboard-content.tmpl.html',
        controller: 'HomeController'
      }).
      when('/registration',{
        templateUrl: 'partials/registration-page.tmpl.html',
        controller: 'HomeController'
      }).
      otherwise({
        redirectTo: '/'
      });
      
      // use the HTML5 History API
        //$locationProvider.html5Mode(true);
  }]);