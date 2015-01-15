var express = require('express');
var moment = require('moment');
var models=require('../models/');
var winston = require('winston');
var jwt=require('jsonwebtoken');
var commentModel = models.Comment;
var userModel = models.User;
var teamModel = models.Team;
var router = express.Router();
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {level:'debug', 
colorize: true,
prettyPrint: true,
depth:3 });
/* GET users listing. */
router.get('/', function(req, res) {
  userModel.find(function(err,data){
     res.send(data);
  })
 
});
router.get('/:id/show',function(req,res){
    winston.log('Request for id'+req.params.id);
    userModel.findOne({email:req.params.id}).populate('team','teamName').sort('approvalStatus').exec(function(err,data){
      if(err)
      {
        res.send(500,err);
        return;
      }
      if(data===null)
      {
        res.send(500,"No user was found");
      }
      res.send(data);
    })
});
router.get('/:id/chat',function(req,res){
    winston.debug('Chat for id get'+req.params.id);
    commentModel.find({type:'PublicChat'},function(err,data){
      res.send(data);
    });
});
/**
 * @desc Route handler for posting a chat message
 * 
 * 
 * 
 */ 
router.post('/:id/chat',function(req,res){
    winston.debug('Chat for id post'+req.params.id);
     winston.debug('broadcast message:' + JSON.stringify(req.body.message));
     var message={};
     message.postTS=moment().fromNow();
     message.post=req.body.message.post;
     message.poster=req.body.message.poster;
     message.teamName=req.body.message.teamName;
     var channel="/"+message.teamName;
     
     if(req.body.message.type==='PublicChat')
     {
       channel="/public";
     }
     winston.debug('VAlue of  broadcast channel'+channel);
    req.bayeuxInstance.getClient().publish(channel, { text: message }).then(function(data) {
  winston.log('Message published by server!'+data);
}, function(error) {
  winston.log('There was a problem: ' + error.message);
});;
    
    res.status(200).send({ message: 'Success' });

});

/***
 * @desc Route handler for registering a new user
 * 
 * 
 * 
 * 
 */ 
router.post('/',function(req,res){
  var user= req.body;
  winston.debug('In registration'+JSON.stringify(req.body));
  if(user=={})
  {
    res.status(500).json({message:'No User was sent'});
  }
  teamModel.find({teamName:user.teamName},function(err,data){
    if(err)
    {
      res.status(500);
      res.json('Error');
    }
    else{
    if(data.length===0)
    {
      winston.debug('Team not found');
      var newTeam = new teamModel({teamName:user.teamName});
      newTeam.save(function(error,resp){
        if(err)
        {
          res.status(500);
          res.json('Error');
        }
        if(resp===null)
        {
          res.status(500);
          res.json('Error while saving new team'+error);
          return;
        }
        winston.debug('Name of team'+resp._id);
        var newUserWithNewTeam = new userModel({fullName:user.fullName,approvalStatus:'Pending',password:user.password,phone:user.phone,email:user.email,team:resp._id});
        newUserWithNewTeam.save(function(err,data){
           if(err)
        {
          res.status(500);
          res.json(err);
          return;
        }
          res.status(200);
          var profile = {
          displayName: data.firstName,
          email: data.email
          };
          winston.debug('Value of profile new team'+JSON.stringify(profile));
          var token = jwt.sign(profile, 'secret', { expiresInMinutes: 60*5 });
          res.json({ token: token });
        })
      })
    }
    else
    {
      winston.log('Team was found'+data[0]._id);
       var newUserWithExistingTeam = new userModel({fullName:user.fullName,approvalStatus:'Pending',email:user.email,password:user.password,team:data[0]._id});
       newUserWithExistingTeam.save(function(err,data){
         if(err)
        {
          res.status(500);
          res.json(err);
        }else
        {
          res.status(200);
          var profile = {
          displayName: data.firstName,
          email: data.email
          };
          winston.debug('Value of profile'+JSON.stringify(profile));
          var token = jwt.sign(profile, 'secret', { expiresInMinutes: 60*5 });
          res.json({ token: token });
        }
        })
    }
    }
  });
  
  
})
module.exports = router;
