var express = require('express');
var models=require('../models/');
var userModel = models.User;
var teamModel = models.Team;
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    var property=req.query.property;
    console.log('In unique route'+req.query.property+' value '+req.query.value);
    if(property==='email'){
  userModel.find({email:req.query.value},function(err,data){
      if(data&&data.length>0)
      {
        res.send({property:'email',exists:true});
      }
      else
      {
          res.send({exists:false});
      }
  })
    }
    else if(property==='teamName')
    {
        teamModel.find({teamName:req.query.value},function(err,data){
      if(data&&data.length>0)
      {
        res.send({property:'teamName',exists:true});
      }
      else
      {
          res.send({property:'teamName',exists:false});
      }
  })
        
        
    }
 
});

module.exports = router;