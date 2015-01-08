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
    max: 1000
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
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  password: String,
  email: {
    type: String,
    required: true,
    trim: true
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



exports.User = mongoose.model('User', User);
exports.Team = mongoose.model('Team',Team);