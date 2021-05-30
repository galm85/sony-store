const mongoose = require('mongoose');

const categorieSchema = new mongoose.Schema({
    title:String,
    parentCategorieId:String,
    parentCategorieTitle:String,
    image:String
},{timestamps:true})

const Categorie = mongoose.model('Categorie',categorieSchema);


module.exports = Categorie;