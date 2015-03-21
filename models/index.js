var mongoose = require('mongoose');
var db = require('../db');
var connection= db.connection;
var autoIncrement = db.autoIncrement;
var Schema = mongoose.Schema;

var Team = new Schema ({
  team_id: {
    type: Number,
    trim: true
  },
  teamName: {
    type: String,
    trim: true,
    max: 1000,
    index:true
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated:  {
    type: Date,
    default: Date.now,
    required: true
  }
});


var User = new Schema({

  fullName: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type:String,
    required:true,
    trim:true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    index:true
  },
  approvalStatus:{
      type:String,
      required:true
  }, 
  role:{
    type:String,
    required:true},
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated:  {
    type: Date,
    default: Date.now
  }
});

var Comment = new Schema({
  comment_id:{type: Number,
    trim: true},
  poster:{type: Schema.Types.ObjectId,
    ref: 'User'},
  postTS:{type: Date,
    default: Date.now},
  type:{type:String,
      required:true},
  post:{type: String,
    required: true,
    trim: true},    
  teamName:{type: Schema.Types.ObjectId,
    ref: 'Team'}    
});


var Clue = new Schema({
 clue_img:{type:String,required:true} ,
 map_img:{type:String,required:true},
 name:{type:String,required:true},
 passCode:{type:String,required:true},
 order:{type:Number,required:true}
 
});
Clue.plugin(autoIncrement.plugin, 'Clue');  


var ClueTeam = new Schema({
  clue:{type:Number,ref:'Clue'},
  team:{type: Schema.Types.ObjectId,ref:'Team',
  required:true},
  solvedTS: {
    type: Date,
    default: Date.now
  }
});
exports.User = connection.model('User', User);
exports.Team = connection.model('Team',Team);
exports.Comment = connection.model('Comment',Comment);
exports.Clue = connection.model('Clue',Clue);
exports.ClueTeam = connection.model('ClueTeam',ClueTeam);