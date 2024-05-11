const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  earnings: {
    type: Number,
    default: 0,
  },
  updateQuery : {
    type : {},
    required : false
  }
});

const User = mongoose.model('User', userSchema);

const parentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Parent = mongoose.model('Parent', parentSchema);

module.exports = { User, Parent };
