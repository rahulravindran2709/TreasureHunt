app.service('NewsFeedService',['$http','$q',function($http,$q){
    console.log('In news feed service');
    this.getPublicFeeds = function(){
        
        var publicFeeds = [
            {poster:'Rahul Ravindran',post:'lauda',postTS:'0 minutes ago',teamName:'Bucanneers'},
            {poster:'Bimal Das',post:'chutiya',postTS:'1 minutes ago',teamName:'Gays'},
        {poster:'Abdul Jaleel',post:'maire',postTS:'2 minutes ago',teamName:'Privateers'},
        {poster:'Manish Lall',post:'bhosdke',postTS:'3 minutes ago',teamName:'Bucanneers'}
        ];
       return publicFeeds;
    };
    this.getTeamFeed = function(userid){
        
    };
}]);