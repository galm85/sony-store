const router = require('express').Router();
const User = require('../models/usersModel');
const Product = require('../models/productsModel');
const multer = require('multer');
const bcrypt = require('bcrypt');

//multer Config
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        if(file){
            cb(null,'./uploads/images/usersImages');
        }
    },
    filename:(req,file,cb)=>{
        if(file){
            cb(null,new Date().toISOString()+'-'+file.originalname);
        }
    }
})

const upload = multer({storage:storage});


//get all users
router.get('/',async(req,res)=>{
    const users = await User.find({});
    res.send(users);
});


// post new user
router.post('/',upload.single('image'),async(req,res)=>{
    let user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).send('Email is already taken');
    }
    user = new User(req.body);
    if(req.file){
        user.image = req.file.path;
    }else{
        user.image = 'uploads/images/noUser.jpeg';
    }

    const solt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,solt);
    await user.save();
    return res.status(200).send('user saved');


})

//sign-in user
router.post('/sign-in',async(req,res)=>{
    let user = await User.findOne({email:req.body.email});
    if(!user){
        return res.status(400).send('No email');
    }
    let compare = await bcrypt.compare(req.body.password,user.password);
    if(!compare){
        return res.status(400).send('No Password');
    }

    return res.status(200).send(user.renderToken());
})

//get user profile
router.get('/profile/:userId',async(req,res)=>{
    let user = await User.findById(req.params.userId);
    return res.status(200).send(user);
})


// Update user
router.patch('/update-user/:userId',upload.single('image'),async(req,res)=>{
    try {
        let user = req.body;
        if(req.file){
            user.image = req.file.path;
        }
        if(user.password){
            const solt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password,solt);

        }
        
        await User.findByIdAndUpdate(req.params.userId,user);
        res.status(200).send('user update');
    } catch (error) {
        res.status(404).send(error.message);
    }
})


//delete user
router.delete('/delete-user/:userId',async(req,res)=>{
    const user = await User.findByIdAndRemove(req.params.userId);
    res.send(user);
})


//Get cart items
router.get('/cart/:userId',async(req,res)=>{
    const {cart} = await User.findById(req.params.userId);
    let list = [];

    for(let item of cart){
        let product = await Product.findById(item.productId);
        let cartItem = {
            _id:product._id,
            title:product.title,
            image:product.image,
            price:product.price,
            amount:item.productAmount,
        }
 
        list.push(cartItem);
    }
    res.status(200).send(list);
})


//Add new item to cart
router.patch('/cart/add-to-cart/:userId',async(req,res)=>{
    let product = await Product.findById(req.body.productId);
    let {cart} = await User.findById(req.params.userId);

    for(let item of cart){
        
        if(item.productId == req.body.productId){
            item.productAmount ++;
            await User.findByIdAndUpdate(req.params.userId,{cart:cart});
            return res.status(200).send({cart:cart,message:'update amount'});
        } 
    }

    let newItem = {
        productId:req.body.productId,
        productAmount:req.body.amount
    }

    cart.push(newItem);
    await User.findByIdAndUpdate(req.params.userId,{cart:cart});
    return res.status(200).send({cart:cart,message:product.title+' added to cart'});

})


//remove from cart
router.patch('/cart/remove-item/:userId',async(req,res)=>{
    try{
        let {cart} = await User.findById(req.params.userId);
        cart = cart.filter(item=>item.productId != req.body.productId);
        await User.findByIdAndUpdate(req.params.userId,{cart:cart});
        res.status(200).send({cart:cart,message:'Item'});
    }catch(error){
        console.log(error);
    } 

})


//Update amout +/- from the cart page
router.patch('/cart/update-amount/:userId',async(req,res)=>{
    console.log(req.body)
    const op = req.body.op;
    
    try {
        let {cart} = await User.findById(req.params.userId);
        
        for(let item of cart){
            if(item.productId == req.body.productId){
                if(op === '+'){
                    item.productAmount ++;
                }
                if(op === '-' && item.productAmount >1){
                    item.productAmount --;
                }
            }
        }

        await User.findByIdAndUpdate(req.params.userId,{cart:cart});
        res.status(200).send({cart:cart,message:'Update amount'});
    } catch (error) {
        console.log(error);
    }
})


//clear cart
router.patch('/cart/clear-cart/:userId',async(req,res)=>{
    console.log('clear cart');
    await User.findByIdAndUpdate(req.params.userId,{cart:[]});
    res.status(200).send('cart Cleared');
})



//get wish list items
router.get('/wish-list/:userId',async(req,res)=>{
    const {wishList} = await User.findById(req.params.userId);
    let list = [];
    for(let item of wishList){
        let product = await  Product.findById(item);
        list.push(product);
    }

    res.status(200).send(list);
    
})


//add item to wish list
router.patch('/wish-list/add/:userId',async(req,res)=>{
    const product = await Product.findById(req.body.productId);
    let {wishList} = await User.findById(req.params.userId);

    wishList.push(req.body.productId);
    await User.findByIdAndUpdate(req.params.userId,{wishList});
    res.status(200).send({message:product.title + ' added to the wishList',wishList:wishList});

})

//remove from wish List
router.patch('/wish-list/remove/:userId',async(req,res)=>{
    const product = await Product.findById(req.body.productId);
    let {wishList} = await User.findById(req.params.userId);

    wishList = wishList.filter(item=>item != req.body.productId);
    await User.findByIdAndUpdate(req.params.userId,{wishList});
    res.status(200).send({message:product.title + ' removed from wishList',wishList:wishList});



})


module.exports = router;