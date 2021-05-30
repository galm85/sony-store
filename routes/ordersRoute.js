const router = require('express').Router()
const Order = require('../models/ordersModel');



//get all orders
router.get('/',async(req,res)=>{
    const orders = await Order.find({});
    res.send(orders);
})

// add new order
router.post('/',async(req,res)=>{
    let newOrder  = new Order(req.body);
    newOrder.status = 'New Order',
    await newOrder.save();
    res.status(200).send('New Order Added');
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

router.post



module.exports = router;