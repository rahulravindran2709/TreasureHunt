/**
 * @name uniqueValidator
 * @desc This directive will query through http and find out if a given value is unique
 * 
 */
(function(){
    var app=window.angular.module('UniqueFieldValidatorModule',[]);
    /**
     * @name uniqueValidator
     * @desc Main directive which binds a blur event to the field and makes the service call
     * to check if the field is unique.The validation display is handled asynchronously through promises
     * 
     * 
     * 
     */ 
    app.directive('uniqueValidator', ['UniqueValidatorService',function(uniqueValidatorService) 
    {
        var linkFn=function(scope, elem, attrs,ngModel)
        {
            var vm=this;
            vm.ngModel=ngModel;
            vm.scope=scope;
            var config=scope.$eval(attrs.uniqueValidator);
            /*If the value is truly unique then we would want to set validation as passed*/
            vm.successCallback=function successCallback(unique){
                vm.ngModel.$setValidity('unique',true);
                console.log('Value of validity success case'+vm.ngModel.$valid);
            };
            /*Set validity as false to make sure we have a */
            vm.errorCallback=function errorCallback(error){
                 ngModel.$setValidity('unique',false);
                 console.log('Value of validity error case'+ngModel.$valid);
            };
            var blurHandler=function(event){
                console.log('In blur'+ngModel);
                 if (!ngModel || !elem.val()) return;
                var currentValue=elem.val();
                uniqueValidatorService.checkUniqueness(config.url,config.property,currentValue).then(function(data){
                    vm.successCallback(data);
                    
                },function(error){vm.errorCallback(error)});
            }
            elem.bind('blur',blurHandler.bind(vm));
    
        };
        return {
            restrict: 'A',
            scope:{},
            require:'ngModel',
            link: linkFn
        };
    }
    ])
    .directive('uniqueErrorMessage',function(){
        var linkFn= function(scope, elem, attrs,ngModel){
            scope.message='Email is in use';
        };
         return {
            restrict: 'E',
            replace:true,
            template:'<span ng-show="registrationForm.email.$dirty && registrationForm.email.$error.unique" >{{message}}</span>',
            link: linkFn
        };
        
        })
        .service('UniqueValidatorService',['$http','$q',function($http,$q){
            this.checkUniqueness=function checkUniqueness(url,property,value){
                var getUrl=url+'?property='+property+'&value='+value;
                var deferred = $q.defer();
                $http.get(getUrl).then(function(response){
                    var data=response.data;
                    console.dir(data);
                    if(data.exists){
                        deferred.reject('Duplicate'+data.exists);
                    }
                    else{
                        deferred.resolve();
                    }
                },function(error){
                    deferred.reject(error);
                });
                return deferred.promise;
                
            };
        }]);

})();