(function(){
    var angularSimpleAuth = angular.module('angularSimpleAuth', []);
    angularSimpleAuth.constant('authEvents',{
        AUTH_SUCCESS:'auth-success',
        AUTH_INVALID:'auth-invalid',
    })
    .controller('AuthController',['$scope','Credentials','AuthService','authEvents','$rootScope',function($scope,credentials,authService,authEvents,$rootScope){
        var authSucessCallback=function(data){
            credentials.setUsername($scope.credentials.username);
            $rootScope.$broadcast(authEvents.AUTH_SUCCESS);
            
        }
        function init(){
            $scope.credentials={username:'',password:''};
            $scope.isAuthenticated=false;
            
        }
        init();
        this.setAuthAction=function(action){
            $scope.loginUrl=action;
        };
        this.setUserName=function(username){
            console.log('Setting');
            $scope.credentials.username=username;
        };
        this.setPassword=function(password){
            $scope.credentials.password=password;
        };
        this.executeLoginAction=function(){
            console.log('Executed'+angular.toJson($scope.credentials)+$scope.loginUrl);
                authService.login($scope.credentials,$scope.loginUrl).then(authSucessCallback,function(){
                    console.log('Error');
                })
            };
    }]).directive('simpleAuthForm',['Credentials',function(credentials){
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
                    console.log($scope.currentUser);
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
    .factory('Credentials',['$q',function($q){
        var username='';
        var roles=[];
        var currentUserData='';
        var checkUserLoggedInLocal=function(){
            var deferred=$q.defer();
            if(username!=='')
            {
                deferred.resolve();
            }
            else{
                deferred.reject();
            }
            return deferred.promise;
        }
        var setUserNameLocal=function(usernameParam){
            username=usernameParam;
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
        checkUserLoggedIn:checkUserLoggedInLocal
        }
    }]).service('AuthService',['$http',function($http){
        this.login=function(data,url){
            var promise =$http.post(url,data);
            return promise.then();
        }
    }]).run(['$rootScope','Credentials','$location',function($rootScope,credentials,$location) {
        
        $rootScope.$on('$routeChangeStart',function(){
            credentials.checkUserLoggedIn().then(function(){
            console.log('OK');
        },function(error){
            console.log('Error');
            $location.path('/');
        });
            
        });
    }]);
    
})();