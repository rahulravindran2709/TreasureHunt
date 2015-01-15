var express = require('express');
var models=require('../models/');
var jwt=require('jsonwebtoken');
var userModel = models.User;
var router = express.Router();


router.post('/',function(req,res){
   
  //TODO validate req.body.username and req.body.password
  //if is invalid, return 401
  
  userModel.findOne({email:req.body.username},function(err,data){
      
      if(data===null)
      {
        res.send(401, 'No user found');
        return;
      }
      console.log('Data retrieved'+data.password);
      if (req.body.password !== data.password) {
    res.send(401, 'Wrong user or password');
    return;
  }
  var profile = {
    displayName: data.firstName,
    email: data.email

  };
  // We are sending the profile inside the token
  var token = jwt.sign(profile, 'secret', { expiresInMinutes: 60*5 });
  res.json({ token: token });
  });
  

  
  
});

module.exports = router;