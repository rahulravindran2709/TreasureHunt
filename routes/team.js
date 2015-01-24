var express = require('express');
var models=require('../models/');
var teamModel = models.Team;
var clueTeamModel = models.ClueTeam;
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
    winston.debug('Request for id'+req.params.id);
    res.json({id:'1',username:'Rahul',teamName:'bucaneers',stepsTotal:6,stepsRemaining:2})
});
router.get('/:id/game',function(req,res){
  winston.debug('In get clues by team'+req.params.id);
  clueTeamModel.find().populate({
  path: 'team',
  match: { teamName: req.params.id}
}).exec(function(err,data){
  winston.debug('Clues for the team'+JSON.stringify(data));
});
});

module.exports = router;
