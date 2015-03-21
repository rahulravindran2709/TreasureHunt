var app=angular.module('TreasureHunt',['ngRoute','ngAnimate','angularSimpleAuth','angular-chartist','UniqueFieldValidatorModule','AnimationModule','scrollerModule']);
app.constant('faye',Faye);
app.constant('roles',{ROLE_ADMIN:'admin',ROLE_PLAYER:'player'});
app.constant('routeConstants',{
  LANDING_URL:'/',
  GAME_URL:'/game',
  LOGIN_URL:'/login',
  LEADERBOARD_URL:'/leaderboard',
  REGISTER_URL:'/registration',
  ADMIN_CLUES_URL:'/admin/clues',
  ADMIN_LANDING_URL:'/admin/'
});
app.constant('apiURLConstants',{
  GET_ALL_TEAMS_URL:'/api/teams/',
  GET_ALL_USERS_URL:'/api/users/',
  USER_ADD_URL_SUFFIX:'/show',
  USER_CHAT_URL_SUFFIX:'/chat',
  PUBLIC_MESSAGING_URL:'/public',
  TEAMS_CLUE_SUFFIX:'/game',
  GET_ALL_CLUES:'/api/clues/'
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
        controller: 'GameController'
      })
      .when(routeConstants.REGISTER_URL,{
        templateUrl: 'partials/registration-page.tmpl.html',
        controller: 'RegistrationController'
      })
      .when(routeConstants.ADMIN_CLUES_URL,{
        templateUrl: 'partials/admin-clues.tmpl.html',
        controller: 'AdminCluesController',
        resolve:['roles','AuthorizationService',function(roles,AuthorizationService){
          console.log('In resolve');
          return AuthorizationService.checkUserPermissions(roles.ROLE_ADMIN);
        }]
      })
      .when(routeConstants.ADMIN_LANDING_URL,{
        templateUrl: 'partials/admin-page.tmpl.html',
        controller: 'AdminController',
        resolve:{app:['roles','AuthorizationService',function(roles,AuthorizationService){
          console.log('In resolve');
          return AuthorizationService.checkUserPermissions(roles.ROLE_ADMIN);
        }]}
      })
      .otherwise({
        redirectTo: routeConstants.LANDING_URL
      });
      
      // use the HTML5 History API
        //$locationProvider.html5Mode(true);
  }]);