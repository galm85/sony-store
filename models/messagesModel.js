const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    name:String,
    phone:String,
    email:String,
    message:String,
    status:String
},{timestamps:true})

const Message = mongoose.model('Message',messageSchema);


module.exports = Message;