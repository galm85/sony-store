const mongoose = require('mongoose');

const articleschema = new mongoose.Schema({
    title:String,
    image:String,
    summery:String,
    article:String,
    comments:[],
},{timestamps:true})

const Article = mongoose.model('Article',articleschema);


module.exports = Article;