/**
 * @name AngularSimpleAuth
 * @author Rahul Ravindran
 * @desc This module can be used to to decalaritively add authentication to an angularjs application.The aim of this 
 * is to mainimise as much auth boilerplate javascript as possible by exposing attribute and element directives which add
 * the required functionality
 */
(function(){
    var angularSimpleAuth = angular.module('angularSimpleAuth', []);
    angularSimpleAuth.constant('authEvents',{
        AUTH_SUCCESS:'auth-success',
        AUTH_INVALID_CRED:'auth-invalid-credentials',
        AUTH_UNAUTHORIZED_ACCESS:'auth-unauthorized'
    })
    /**
     * @name AuthController
     * @desc The main controller used for the authenticaion mechanism.This controller exposes methods for setting credentials which are used by child directives
     * This controller is bound to the simpleAuthForm directive
     */
    .controller('AuthController',['$scope','Credentials','AuthService','authEvents','$rootScope','$window','$location',function($scope,credentials,authService,authEvents,$rootScope,$window,$location){
        var authFailureCallback=function(data){
             console.log('Invalid credentials passed');
             $rootScope.$broadcast(authEvents.AUTH_INVALID_CRED);
             $location.path('/login');
        }
        /*
        * @name authSucessCallback
        * @desc This private function is used as the success callback in the event of successfull authentication
        *
        */
        var authSucessCallback=function(data){
            $window.sessionStorage.setItem('token',data.data.token);
            credentials.setUsername($scope.credentials.username);
            authService.getUserDetailsByUsername($scope.credentials.username,'UserService').then(function(data){
                console.log('Success while getting the user data'+angular.toJson(data.data));
                
                $rootScope.$broadcast(authEvents.AUTH_SUCCESS);
                 credentials.setCurrentUserData(data.data);
                 $window.sessionStorage.setItem('currentUser',credentials);
                 $location.path('/');
                 
            });
        }
        function init(){
            $scope.credentials={username:'',password:''};
            $scope.isAuthenticated=false;
            
        }
        init();
        /**
         * @name setAuthAction
         * @desc This is a setter method for the login url which will be invoked for authentication
         */
        this.setAuthAction=function(action){
            $scope.loginUrl=action;
        };
        /**
         * @name setUserName
         * @desc This is a setter method for the username which is invoked byt the simple auth username directive to bind the text field value
         */
        this.setUserName=function(username){
            $scope.credentials.username=username;
        };
        /**
         * @name  setPassword
         * @desc This is a setter method for the password which is invoked byt the simple-auth-password directive to bind the password field value
         * 
         */
        this.setPassword=function(password){
            $scope.credentials.password=password;
        };
        /**
         * @name executeLoginAction
         * @desc This method is the click handler for the login button denoted by the simple-auth-login directive
         */
        this.executeLoginAction=function(){
            console.log('Executed login action'+angular.toJson($scope.credentials)+$scope.loginUrl);
                authService.login($scope.credentials,$scope.loginUrl).then(authSucessCallback,authFailureCallback)
            };}])
    /**
     * @name simpleAuthForm
     * @desc The main directive which initialises many of the configurational values like the login url,name of the service to be invoked for getting the user details
     * @params authAction-Pass the url which needs to be invoked for authentication
     * 
     */ 
    .directive('simpleAuthForm',['Credentials',function(credentials){
        return {
            restrict: 'A',
            replace: false,
            scope:{authAction:'@'},
            controller:'AuthController',
            compile:function(tElem,tAttrs){
                
                return this.link;
            },
            link: function($scope, elem, attrs,authController) {
                authController.setAuthAction($scope.authAction);
            }
        };
    }]).directive('simpleAuthUsername',function(){
        return {
            restrict: 'A',
            replace: true,
            scope:{},
            require:['^simpleAuthForm'],
            template:'<input type="text" ng-model="username">',
            controller:function($scope){
                $scope.credentials={};
            },
            link: function($scope, elem, attrs,controllers) {
                $scope.$watch('username',function(val){
                    var simpleAuthController=controllers[0];
                    simpleAuthController.setUserName(val);
                });
                
                
            }
        };
    }).directive('simpleAuthPassword',function(){
        return {
            restrict: 'A',
            replace: true,
            require:['^simpleAuthForm'],
            template:'<input type="password" ng-model="password">',
            link: function($scope, elem, attrs,controllers) {
                $scope.$watch('password',function(val){
                    var simpleAuthController=controllers[0];
                    simpleAuthController.setPassword(val);
                });
            }
        };
    }).directive('simpleAuthLogin',function(){
        return {
            restrict: 'A',
            replace: false,
            require:['^simpleAuthForm'],
            link: function($scope, elem, attrs,controllers) {
                elem.bind('click',function(){
                    controllers[0].executeLoginAction();
                })
            }
        };
    }).directive('simpleAuthSecured',['authEvents',function(authEvents){
        return {
            restrict: 'E',
            replace: true,
            transclude:true,
            template:'<div ng-show="isAuthenticated" ng-transclude></div>',
            controller:['$scope','Credentials',function($scope,credentials){
                
                $scope.$on(authEvents.AUTH_SUCCESS,function(){
                    console.log('Auth success');
                    $scope.isAuthenticated=true;
                    $scope.currentUser=credentials.getCurrentUser();
                });
            
            }],
            link:function($scope, elem, attrs) {}
        }
    }]).directive('simpleAuthUnsecured',['authEvents',function(authEvents){
        return {
            restrict: 'E',
            replace: true,
            transclude:true,
            template:'<div ng-show="!isAuthenticated" ng-transclude></div>',
            controller:['$scope','Credentials',function($scope,credentials){
                
                $scope.$on(authEvents.AUTH_SUCCESS,function(){
                    console.log('Auth success');
                    $scope.isAuthenticated=true;
                });
            
            }],
            link:function($scope, elem, attrs) {}
        
            
        }
    }])
    .directive('simpleAuthCredentials',function(){
        return {
            restrict: 'E',
            replace: true,
            scope:true,
            require:['^simpleAuthSecured'],
            template:'<span ng-show="isAuthenticated" ng-bind="currentUser.username"></span>',
            link:function($scope, elem, attrs,controllers) {
                console.log('In linke'+controllers);
            }
        
            
        }
    })
    .factory('Credentials',['$q','$window',function($q,$window){
        var username='';
        var roles=[];
        var currentUserData='';
        var clone=function(data){
            username=data.username;
            roles=data.roles;
            currentUserData=data.currentUserData;
        }
        var checkUserLoggedInLocal=function(){
            var deferred=$q.defer();
            if(username!=='')
            {
                deferred.resolve();
            }
            else{
                //Check in session storage
                 if($window.sessionStorage.getItem('currentUser'))
                 {
                     clone($window.sessionStorage.getItem('currentUser'));
                     deferred.resolve();
                 }
                 else{
                        deferred.reject();
                 }
            }
            return deferred.promise;
        }
        var setUserNameLocal=function(usernameParam){
            username=usernameParam;
        }
        var setCurrentUserDataLocal=function(data){
            currentUserData=data;
        }
        var getCurrentUserLocal=function(){
            return {
                username:username,
                data:currentUserData
            }
        }
        return {
        setUsername:setUserNameLocal,
        getCurrentUser:getCurrentUserLocal ,   
        checkUserLoggedIn:checkUserLoggedInLocal,
        setCurrentUserData:setCurrentUserDataLocal
        }
    }]).service('AuthService',['$http','$q','$injector',function($http,$q,$injector){
        this.login=function(data,url){
            var promise =$http.post(url,data);
            return promise.then();
        }
        this.getUserDetailsByUsername=function(username,servicename){
            return $injector.get(servicename).getUserByUsername(username);
        }
    }])
    /**
     * @name TokenAuthInterceptor
     * @desc This http interceptor is used to inject the token into every outgoing http request.Currently only requests
     * with 'api' in the url are injected with the token.
     * @param $rootScope- root scope of the angularjs app
     *        $window - angularj window object
     *        $q - defer
     *        authEvents - constant with values for event names
     * 
     */ 
    .factory('TokenAuthInterceptor',['$rootScope','$window','$q','authEvents',function($rootScope,$window,$q,authEvents){
        var requestLocal=function(config){
            config.headers = config.headers || {};
            console.log('$window.sessionStorage.token'+$window.sessionStorage.token);
                if ($window.sessionStorage.token&&config.url.indexOf('api')!=-1) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                }
                return config;
        };
        var responseLocal=function(response){
               if (response.status === 401) {
                $rootScope.$broadcast(authEvents.AUTH_UNAUTHORIZED_ACCESS);
      }
      return response || $q.when(response);
        }
        return {
            request:requestLocal,
            response:responseLocal
        }
    }])
    .config(function($httpProvider){
         $httpProvider.interceptors.push('TokenAuthInterceptor');
    })
    .run(['$rootScope','Credentials','$location','authEvents',function($rootScope,credentials,$location,authEvents) {
        
        $rootScope.$on('$routeChangeStart',function(event,next,current){
            credentials.checkUserLoggedIn().then(function(){
            console.log('OK');
            $rootScope.$broadcast(authEvents.AUTH_SUCCESS);
        },function(error){
            console.log('Error in route authentication'+angular.toJson(error));
            $location.path('/login');
        });
            
        });
    }]);
    
})();