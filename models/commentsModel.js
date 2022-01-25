const mongoose = require('mongoose');

const commentschema = new mongoose.Schema({
    title:String,
    body:String,
    author:String,
    authorId:mongoose.Types.ObjectId,
    articleId:mongoose.Types.ObjectId,
},{timestamps:true})

const Comment = mongoose.model('Comment',commentschema);


module.exports = Comment;