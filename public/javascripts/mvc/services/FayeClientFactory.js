app.factory('FayeClientFactory',['faye',function(faye){
    var client = new faye.Client('/faye',{
				timeout: 20
			});
	return client;		
}]);