var express = require('express');
var models=require('../models/');
var teamModel = models.Team;
var router = express.Router();
var winston = require('winston');
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {level:'debug', 
colorize: true,
prettyPrint: true,
depth:3 });
/* GET all teams listing. */
router.get('/', function(req, res) {
  
  teamModel.find({},function(error,data){
    if(error)
    {
      res.status(500);
      res.json({error:error});
    }
      res.status(200).json(data);
  });
});
router.get('/:id/show',function(req,res){
    console.log('Request for id'+req.params.id);
    res.json({id:'1',username:'Rahul',teamName:'bucaneers',stepsTotal:6,stepsRemaining:2})
});
module.exports = router;
