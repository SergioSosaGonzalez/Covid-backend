const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userBlockSchema = new mongoose.Schema({
    status:{type:String,default:"ACCEPT"},
    userId:{type: schema.ObjectId, ref: 'User'},
    attemps:{type:Number,default:0},
    expire_at: {type: Date, default: Date.now, expires: 7200},
});

const User = mongoose.model('UserBlock', userBlockSchema);

module.exports = User;
