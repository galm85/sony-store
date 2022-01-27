const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    name:String,
    phone:String,
    email:String,
    subject:String,
    message:String,
    status:String,
    read:Boolean,
},{timestamps:true})

const Message = mongoose.model('Message',messageSchema);


module.exports = Message;