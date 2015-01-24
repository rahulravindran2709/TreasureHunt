var express = require('express');
var models=require('../models/');
var clueModel = models.Clue;
var router = express.Router();
var winston = require('winston');

router.post('/',function(req,res,next){
    winston.debug('Value of request body'+JSON.stringify(req.body));
    
    /*var clue = new clueModel({name:newClue.name,clue_img:newClue.clue_img,map_img:newClue.map_img,passCode:newClue.passCode,order:newClue.order});
    clue.save(function(err,data){
        if(err)
        {
            winston.error('Erro while trying to save');
            res.status(500).send(err);
            return;
        }
        res.status(200).send('Successfull received');
        
    });*/
    res.status(200).send('Suceess');
});
router.get('/',function(req,res,next){
    clueModel.find({}).sort('order').exec(function(error,data){
        res.status(200).send(data);
    })
})
module.exports=router;