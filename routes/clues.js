var express = require('express');
var fs = require('fs');
var path=require('path');
var models=require('../models/');
var clueModel = models.Clue;
var router = express.Router();
var winston = require('winston');

router.post('/',function(req,res,next){
    winston.debug('Value of request body'+JSON.stringify(req.body)+'with user'+req.user);
    winston.debug('Value of request files'+JSON.stringify(req.files));
    var newClue=req.body;
    var name=newClue.name||'TestClue';
    var fullClueSourcePath=path.join('./uploads',req.files.clue_img.name);
    var fullMapSourcePath=path.join('./uploads',req.files.map_img.name);
    var fullClueDestPath=path.join('./public','images/clues',req.files.clue_img.name);
    var fullMapDestPath=path.join('./public','images/maps',req.files.map_img.name);
    copyFile(fullClueSourcePath,fullClueDestPath,function(){
        winston.debug('CLue was copied from '+fullClueSourcePath +' to '+fullClueDestPath);
    });
    copyFile(fullMapSourcePath,fullMapDestPath,function(){
         winston.debug('CLue was copied from '+fullMapSourcePath +' to '+fullMapDestPath);
    });
    newClue.clue_file=req.files.clue_img.name;
    newClue.map_file=req.files.map_img.name;
    
    var clue = new clueModel({name:name,clue_img:newClue.clue_file,map_img:newClue.map_file,passCode:newClue.passCode,order:newClue.order});
    clue.save(function(err,data){
        if(err)
        {
            winston.error('Erro while trying to save');
            res.status(500).send(err);
            return;
        }
        res.status(200).send(data);
        
    });
});
router.get('/',function(req,res,next){
    clueModel.find({}).sort('order').exec(function(error,data){
        var clueDestPath='images/clues';
        var mapDestPath='images/maps';
        var response=[];
        response=data.map(function(elem){
            var newElem={};
            newElem.clue_path=path.join(clueDestPath,elem.clue_img);
            newElem.map_path=path.join(mapDestPath,elem.map_img);
            newElem.order=elem.order;
            newElem.clue_img=elem.clue_img 
            newElem.map_img=elem.map_img
            return newElem;
        },response);
        res.status(200).send(response);
    })
})


router.put('/',function(req,res,next){
    
    
    
});

router.delete('/:id',function(req,res,next){
    winston.debug('Deleting id'+req.params.id);
    res.json({message:'Success'});
})
/**
 * @name copyFile
 * 
 * 
 */ 


function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", done);

  var wr = fs.createWriteStream(target);
  wr.on("error", done);
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}
module.exports=router;