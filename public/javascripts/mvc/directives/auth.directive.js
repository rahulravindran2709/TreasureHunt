(function(){
    var angularSimpleAuth = angular.module('angularSimpleAuth', []);
    angularSimpleAuth.controller('AuthController',['$scope','Credentials','AuthService',function($scope,credentials,authService){
        var setAuthenticated=function(){
            $scope.isAuthenticated=true;
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
                authService.login($scope.credentials,$scope.loginUrl).then(setAuthenticated,function(){
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
                console.log('In form link'+$scope.authAction);
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
    .factory('Credentials',function(){
        var username='';
        var password='';
        var roles=[];
        this.setUsername=function(username){
            username=username;
        }
        this.setPassword=function(password){
            password=password;
        }
    }).service('AuthService',['$q','$http',function($q,$http){
        this.login=function(data,url){
            var promise =$http.post(url,data);
            return promise.then();
        }
    }]);
    
})();