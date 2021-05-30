const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId:String,
    name:String,
    email:String,
    idNumber:String,
    cardNumber:String,
    securityNumber:String,
    address:String,
    state:String,
    phone:String,
    orderDetails:[],
    totalPrice:Number,
    status:String


},{timestamps:true})




const Order = mongoose.model('Order',orderSchema);


module.exports = Order;