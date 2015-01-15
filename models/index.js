var mongoose = require('mongoose');
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
  teamName:{type: Schema.Types.ObjectId,
    ref: 'Team'}    
});

exports.User = mongoose.model('User', User);
exports.Team = mongoose.model('Team',Team);
exports.Comment = mongoose.model('Comment',Comment);