/**
 * @name uniqueValidator
 * @desc This directive will query through http and find out if a given value is unique
 * 
 */
(function(){
    var app=angular.module('UniqueFieldValidatorModule',[]);
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
            /*If the value is truly unique then we would want to set validation as passed*/
            var successCallback=function successCallback(unique){
                ngModel.setValidity('unique',true);
            }
            /*Set validity as false to make sure we have a */
            var errorCallback=function errorCallback(error){
                 ngModel.setValidity('unique',false);
            }
            if (!ngModel || !elem.val()) return;
            elem.bind('blur',function(){
                var currentValue=elem.val();
                uniqueValidatorService.checkUniqueness(currentValue).then(successCallback,errorCallback);
            })
    
        };
        return {
            restrict: 'A',
            scope:{},
            require:'ngModel',
            replace:true,
            link: linkFn
        }
    }
    ])
    .directive('uniqueErrorMessage',function(){
        
         return {
            restrict: 'A',
            scope:{},
            replace:true,
            link: linkFn
        }
        
        });

})()