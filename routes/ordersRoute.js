const router = require('express').Router()
const Order = require('../models/ordersModel');



//get all orders
router.get('/',async(req,res)=>{
    try{
        const orders = await Order.find({}).sort({createdAt:-1})
        return res.status(200).send(orders);

    }catch(error){
        res.status(400).send(error)
    }
})

// add new order
router.post('/',async(req,res)=>{
    try{

        let newOrder  = new Order(req.body);
        newOrder.status = 'New Order',
        await newOrder.save();
        res.status(200).send('New Order Added');
    }catch(err){
        return res.status(400).send(error);
    }
})


//get orders by user
router.get('/profile/:userId',async(req,res)=>{
    const orders = await Order.find({userId:req.params.userId});
    res.status(200).send(orders);
})


//update order status
router.patch('/update-status/:orderId',async(req,res)=>{
    console.log(req.body);
    const order = await Order.findByIdAndUpdate(req.params.orderId,{status:req.body.status});
    res.status(200).send('Order Number: '+order._id+' status is: '+req.body.status);
})

//search order by email
router.get('/search/:email',async(req,res)=>{
    try{
        const orders = await Order.find({email:{ $regex: new RegExp("^" + req.params.email.toLowerCase(), "i") } });
        return res.status(200).send(orders);
    }catch(err){
        res.status(400).send(err);
    }

})
//search order by id
router.get('/search-by-id/:id',async(req,res)=>{
    try{
        orders =[];
        if(await Order.findById(req.params.id)){
            if(order){
                orders.push(order);
                
            }
        }
        return res.status(200).send(orders);
    }catch(err){
        res.status(400).send(err);
    }

})


router.delete('/delete-order/:orderId',async(req,res)=>{
    try{
        await Order.findByIdAndRemove(req.params.orderId);
        return res.status(200).send('Order Deleted');
    }catch(error){
        return res.status(400).send(error);

    }
})



module.exports = router;