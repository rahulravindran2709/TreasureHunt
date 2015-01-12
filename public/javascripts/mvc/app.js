var app=angular.module('TreasureHunt',['ngRoute','ngAnimate','angularSimpleAuth','angular-chartist','UniqueFieldValidatorModule']);
app.constant('faye',Faye);
app.constant('routeConstants',{
  LANDING_URL:'/',
  GAME_URL:'/game',
  LOGIN_URL:'/login',
  LEADERBOARD_URL:'/leaderboard',
  REGISTER_URL:'/registration'
});
app.config(['$routeProvider','$locationProvider','routeConstants',
  function($routeProvider,$locationProvider,routeConstants) {
    $routeProvider.
      when(routeConstants.LANDING_URL, {
        templateUrl: 'partials/landing.tmpl.html',
        controller: 'HomeController'
      }).when('/login',{
        templateUrl: 'partials/login.tmpl.html',
      })
      .when(routeConstants.LEADERBOARD_URL, {
        templateUrl: 'partials/leaderboard-content.tmpl.html',
        controller: 'LeaderboardController'
      })
      .when(routeConstants.GAME_URL, {
        templateUrl: 'partials/game-content.tmpl.html',
        controller: 'HomeController'
      })
      .when(routeConstants.REGISTER_URL,{
        templateUrl: 'partials/registration-page.tmpl.html',
        controller: 'RegistrationController'
      })
      .otherwise({
        redirectTo: routeConstants.LANDING_URL
      });
      
      // use the HTML5 History API
        //$locationProvider.html5Mode(true);
  }]);