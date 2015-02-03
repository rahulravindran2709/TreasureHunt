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
  userModel.find().populate('team','teamName').exec(function(err,data){
    var response =data.map(function(elem,index,input){
      input[index].teamName=elem.team.teamName;
      return input[index];
    });
     res.send(response);
  })
 
});
router.get('/:id/show',function(req,res){
    winston.debug('Request for user details of id'+req.params.id);
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
      //data.teamName=data.team.teamName;
     // data.team={};
     var user=
     {
    fullName: data.fullName,
    approvalStatus: data.approvalStatus,
    email: data.email,
    teamName: data.team.teamName};
      winston.debug('Request for user details of id'+JSON.stringify(data));
      res.send(user);
    })
});
router.get('/:id/chat',function(req,res){
    winston.debug('Chat for id get'+req.params.id);
    commentModel.find({type:'public'}).populate('teamName','teamName').populate('poster','fullName').sort('postTS').exec(function(err,data){
      var output=data.map(function(elem){
        var newElem={};
        newElem.poster=elem.poster.fullName;
        newElem.type=elem.type;
        newElem.post=elem.post;
        newElem.teamName=elem.teamName.teamName;
        newElem.postTS=elem.postTS;
        return newElem
      });
      res.send(output);
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
     /*Prepare broadcast message*/
     var message={};
     message.postTS=moment().fromNow();
     message.post=req.body.message.post;
     message.poster=req.body.message.poster;
     message.teamName=req.body.message.teamName;
     var channel="/"+message.teamName;
     var type='team';
     /*Check if the message type is public*/
     if(req.body.message.type==='PublicChat')
     {
       channel="/public";
       type="public"
     }
     winston.debug('Value of  broadcast channel'+channel);
     userModel.findOne({email:req.params.id}).populate('team').exec(function(err,resp){
       if(err)
       {
         res.send(500,"Erro while user was being found");
         return;
       }
       if(null===resp)
          {
             res.send(500,"No user was found");
              return;
          }
       /*Use the user details to populate the comment fields*/
       winston.debug('User details obtained '+JSON.stringify(resp));
        var newComment = new commentModel({poster:resp._id,type:type,post:message.post,teamName:resp.team._id});
        /*Persist to db*/
        newComment.save(function(err,data){
          if(err)
          {
            res.send(500,"Error while saving comment");
            return;
            
          }
          
          /*Broadcast to peers using faye*/
          req.bayeuxInstance.getClient().publish(channel, { text: message }).then(function(data) {
          winston.debug('Message published by server!');
          res.status(200).send({ message: 'Success' });
          }, function(error) {
            winston.debug('There was a problem: ' + error.message);
          });
        })
       
     });
    

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
