var express = require('express');
var models=require('../models/');
var teamModel = models.Team;
var router = express.Router();

/* GET all teams listing. */
router.get('/', function(req, res) {
  teamModel.find({},function(data){
      res.json(data);
  });
});
router.get('/:id/show',function(req,res){
    console.log('Request for id'+req.params.id);
    res.json({id:'1',username:'Rahul',teamName:'bucaneers',stepsTotal:6,stepsRemaining:2})
});
module.exports = router;
