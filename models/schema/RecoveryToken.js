const mongoose = require('mongoose');
const schema = mongoose.Schema;

const recoveryToken = new mongoose.Schema({
    token:{type:String},
    userId:{type: schema.ObjectId, ref: 'User'},
    status:{type:String,default:"VALID"},
});

const RecoveryToken = mongoose.model('RecoveryToken', recoveryToken);

module.exports = RecoveryToken;
