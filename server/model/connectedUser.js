const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectedUsersSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  connectedUsers: [{
    type: String,  
  }]
});

module.exports = mongoose.model('ConnectedUsers', connectedUsersSchema);
