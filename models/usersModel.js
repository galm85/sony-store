const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    password:String,
    image:String,
    phone:String,
    address:String,
    state:String,
    role:String,
    cart:[],
    wishList:[]



},{timestamps:true})


userSchema.methods.renderToken=function(){
    const token = jwt.sign({_id:this._id,firstName:this.firstName,lastName:this.lastName,email:this.email,role:this.role,image:this.image},"SONY");
    return token;
}

const User = mongoose.model('User',userSchema);


module.exports = User;