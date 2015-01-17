/***
 * @name moment
 * @desc A filter which formats date fields using the moment js library to give relative
 * time elapsed in human readable form
 * 
 * 
 * 
 * 
 */ 
window.angular.module('TreasureHunt').filter('moment',function(){
    var momentFilter=function(input){
        return window.moment(input).fromNow();
    }
    return momentFilter;
});