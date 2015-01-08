var express = require('express');
var models=require('../models/');
var userModel = models.User;
var teamModel = models.Team;
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  userModel.find(function(err,data){
     res.send(data);
  })
 
});
router.get('/:id/show',function(req,res){
    console.log('Request for id'+req.params.id);
    userModel.find({userName:req.params.id}).populate('team','teamName').sort('approvalStatus').exec(function(err,data){
      res.send(data);
    })
});
router.post('/',function(req,res){
  var user= req.body;
  teamModel.find({teamName:user.teamName},function(err,data){
    if(err)
    {
      res.status(500);
      res.json('Error');
    }
    else{
    if(data.length===0)
    {
      console.log('Team not found');
      teamModel = new teamModel({teamName:user.teamName});
      teamModel.save(function(error,resp){
        if(err)
        {
          res.status(500);
          res.json('Error');
        }
        console.log('Name of team'+resp._id);
        userModel = new userModel({firstName:user.firstName,lastName:user.lastName,approvalStatus:'Pending',email:user.email,userName:user.email,team:resp._id});
        userModel.save(function(err,data){
          res.status(200);
          res.json({success:"MY message new team"});
        })
      })
    }
    else
    {
      console.log('Team was found'+data[0]._id);
       userModel = new userModel({firstName:user.firstName,lastName:user.lastName,approvalStatus:'Pending',email:user.email,userName:user.email,team:data[0]._id});
       userModel.save(function(err,data){
         if(err)
        {
          res.status(500);
          res.json('Error');
        }else
        {
          res.status(200);
          res.json({success:"MY message"});
        }
        })
    }
    }
  });
  
  
})
module.exports = router;
