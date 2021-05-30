const mongoose = require('mongoose');

const productschema = new mongoose.Schema({
    title:String,
    categorie:String,
    platform:String,
    image:String,
    price:Number,
    onStock:Boolean,
    onSale:Boolean,
    salePrice:Number,
    description:String,
    sells:{type:Number,default:0},
    rating:Number,
    newGame:Boolean,
    comingSoon:Boolean,
    



},{timestamps:true})

const Product = mongoose.model('Product',productschema);


module.exports = Product;