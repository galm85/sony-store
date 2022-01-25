const mongoose = require('mongoose');

const articleschema = new mongoose.Schema({
    title:String,
    image:String,
    status:String,
    author:String,
    article:String,
    likes:Number,
    comments:[],
},{timestamps:true})

const Article = mongoose.model('Article',articleschema);


module.exports = Article;