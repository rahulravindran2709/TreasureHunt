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
        AUTH_UNAUTHORIZED_ACCESS:'auth-unauthorized',
        AUTH_LOGOUT:'auth-logout'
    }).value('UnsecuredRoutes',{routes:['/login','/registration']})
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
            authService.getUserDetailsByUsername($scope.credentials.username,'UserService').then(function(response){
                 credentials.setCurrentUserData(response.data);
                 $window.sessionStorage.setItem('currentUser',angular.toJson(credentials.getCurrentUser()));
                 $rootScope.$broadcast(authEvents.AUTH_SUCCESS);
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
                authService.login($scope.credentials,$scope.loginUrl).then(authSucessCallback,authFailureCallback)
		 };
        this.initiateLogout=function(){
                    authService.logout().then(function(){
                        $rootScope.$broadcast(authEvents.AUTH_LOGOUT);
                        $location.path('/login');
                    });
                    

                }
    }])
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
	})
	/**
     * @name simpleAuthRole
     * @desc The  directive which secures a block of markup for authorized uses of a specific role
     * @params Pass the role name as the attribute value of the directive itself
     * 
     */ 
	.directive('simpleAuthRole',['Credentials',function(credentials){
	    console.log('Value of role directive');
	    var linkFn= function(scope,elem,attrs){
	        console.log('Value of role'+scope.role);
	        var currentUser=credentials.getCurrentUser();
	        console.log('Current user roles in link'+currentUser.roles);
	        if(currentUser.roles.indexOf(scope.role)!=-1){
	            scope.isAuthorized=true;
	        }
	    }
	    var directiveDefObj={
	        restrict:'E',
	        transclude:true,
	        scope:{role:'@'},
	        replace:true,
	        template:'<div ng-if="isAuthorized" ng-transclude></div>',
	        link:linkFn
	    };
	    
	    
	    
	    return directiveDefObj;
	}])
	.controller('LogoutController',['authEvents','$rootScope','$location','AuthService',function(authEvents,$rootScope,$location,authService){
	    this.initiateLogout=function(){
	        authService.logout().then(function(){
                        $rootScope.$broadcast(authEvents.AUTH_LOGOUT);
                        $location.path('/login');
                    });
	    }
	}])
	
    .directive('simpleAuthLogout',function(){
        return {
            restrict: 'A',
            replace: false,
            scope:{},
            controller:'LogoutController',
            link:function($scope, elem, attrs,controller){
                elem.bind('click',function(){
		    controller.initiateLogout();
                })
            }
        };
    })
    /**
     * @name  simpleAuthSecured
     * @desc This element level directive is used to secure parts of the html page which can only be viewed by a authenticated user
     *       It hides the content when no user is logged in and shows when a user authenticates himself
     *       WOuld mostly be used for content which are not part of the route but still need to be secured
     * 
     */ 
    .directive('simpleAuthSecured',['authEvents',function(authEvents){
        return {
            restrict: 'E',
            replace: true,
            transclude:true,
            template:'<div ng-show="isAuthenticated" ng-transclude></div>',
            controller:['$scope','Credentials',function($scope,credentials){
                
                $scope.$on(authEvents.AUTH_SUCCESS,function(){
                    $scope.isAuthenticated=true;
                    $scope.currentUser=credentials.getCurrentUser();
                });
                $scope.$on(authEvents.AUTH_LOGOUT,function(){
                    $scope.isAuthenticated=false;
                    $scope.currentUser={};
                });
            
            }],
            link:function($scope, elem, attrs) {}
        }
    }])
    /**
     * @name  simpleAuthUnsecured
     * @desc This element level directive is used to secure parts of the html page which needs 
     *       to be shown to an unauthenticated user
     *       more like a guest section of the site
     * 
     */ 
    .directive('simpleAuthUnsecured',['authEvents',function(authEvents){
        return {
            restrict: 'E',
            replace: true,
            transclude:true,
            template:'<div ng-show="!isAuthenticated" ng-transclude></div>',
            controller:['$scope','Credentials',function($scope,credentials){
                
                $scope.$on(authEvents.AUTH_SUCCESS,function(){
                    $scope.isAuthenticated=true;
                });
                $scope.$on(authEvents.AUTH_LOGOUT,function(){
                    $scope.isAuthenticated=false;
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
            currentUserData=data.data;
        }
        var destroyLocal=function(){
            var deferred=$q.defer();
            
            $window.sessionStorage.removeItem('currentUser');
            $window.sessionStorage.removeItem('token');
            username='';
            roles=[];
            currentUserData='';
            deferred.resolve();
            return deferred.promise;
        };
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
                     clone(JSON.parse($window.sessionStorage.getItem('currentUser')));
                     deferred.resolve();
                 }
                 else{
                        deferred.reject('User is not logged');
                 }
            }
            return deferred.promise;
        }
        var setUserNameLocal=function(usernameParam){
            username=usernameParam;
        }
        var setCurrentUserDataLocal=function(data){
            console.log('Credentials being set'+angular.toJson(data));
            currentUserData=data;
            console.log('Value of role being set'+data.role);
            roles.push(data.role);
        }
        var getCurrentUserLocal=function(){
            return {
                username:username,
                data:currentUserData,
                roles:roles
            }
        }
        return {
        setUsername:setUserNameLocal,
        getCurrentUser:getCurrentUserLocal ,   
        checkUserLoggedIn:checkUserLoggedInLocal,
        setCurrentUserData:setCurrentUserDataLocal,
        destroy:destroyLocal
        }
    }]).service('AuthService',['$http','$q','$injector','Credentials',function($http,$q,$injector,credentials){
        this.login=function(data,url){
            var promise =$http.post(url,data);
            return promise.then();
        }
        this.getUserDetailsByUsername=function(username,servicename){
            return $injector.get(servicename).getUserByUsername(username);
        }
        this.logout=function(){
            return credentials.destroy();
            
            
        }
    }])
    /*
     * @name AuthorizationService
     * @desc This service will handle all functionality related to
     * roles based authorization of angular routes
     * 
     * 
     */ 
    .service('AuthorizationService',['$q','Credentials',function($q,credentials){
        var checkUserPermissionsLocal = function(role){
            console.log('In check permission');
            var deferred = $q.defer();
            if(!role|| role.length<=0){
                deferred.reject('No role passed');
            }
            var currentUser = credentials.getCurrentUser();
            if(!currentUser || !currentUser.data)
            {
                console.log('No user logged in');
                 deferred.reject('No user logged in');
            }
            if(!currentUser.roles)
            {
                console.log('User not roles');
                deferred.reject('User doesnt have roles')
            }
            console.log('Role got'+currentUser.roles);
            if(currentUser.roles.indexOf(role)==-1)
            {
                 console.log('User not authorized');
                deferred.reject('User is not authorized');
            }
            deferred.resolve('Authorized');
            return deferred.promise;
        }
        this.checkUserPermissions=checkUserPermissionsLocal;
    }])
    /**
     * @name TokenAuthInterceptor
     * @desc This http interceptor is used to inject the token into every outgoing http request.Currently only requests
     * with 'api' in the url are injected with the token.
     * @param $rootScope- root scope of the angularjs app
     *        $window - angularjs window object
     *        $q - defer
     *        authEvents - constant with values for event names
     * 
     */ 
    .factory('TokenAuthInterceptor',['$rootScope','$window','$q','authEvents',function($rootScope,$window,$q,authEvents){
        var requestLocal=function(config){
            config.headers = config.headers || {};
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
    /**
     * Config function to add the token httpinterceptor to http provider
     * 
     * 
     * 
     */ 
    .config(function($httpProvider){
         $httpProvider.interceptors.push('TokenAuthInterceptor');
    })
    .run(['$rootScope','Credentials','$location','authEvents','UnsecuredRoutes',function($rootScope,credentials,$location,authEvents,unsecuredRoutes) {
        
        var checkIfUnsecuredRoute=function(currentRoute,next){
            
           if(currentRoute===next)
            {
                return true;
           }
        }
        $rootScope.$on('$routeChangeStart',function(event,next,current){
            var unsecuredRouteArr=unsecuredRoutes.routes;
            var result =false;
           for(var index=0;index<unsecuredRouteArr.length;index++)
           {
               result=checkIfUnsecuredRoute(unsecuredRouteArr[index],next.$$route.originalPath);
           }
            if(!result)
            {
            credentials.checkUserLoggedIn().then(function(){
            $rootScope.$broadcast(authEvents.AUTH_SUCCESS);
        },function(error){

            $location.path('/login');
        });}
            
        });
    }]);
    
})();