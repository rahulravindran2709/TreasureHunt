app.factory('FayeClientFactory',['faye',function(faye){
	console.log('in faye factory');
    var client = new faye.Client('/faye',{
				timeout: 20
			});
	return client;		
}]);