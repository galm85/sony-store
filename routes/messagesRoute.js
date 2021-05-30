const router = require('express').Router();
const { findByIdAndUpdate } = require('../models/messagesModel');
const Message = require('../models/messagesModel');


//get all messages
router.get('/',async(req,res)=>{
    const messages = await Message.find({});
    res.status(200).send(messages);
})


router.post('/',async(req,res)=>{
    const message = new Message(req.body);
    message.status = 'unread';
    await message.save();
    res.status(200).send('Thank for your message');
})

router.patch('/update-status/:messageId',async(req,res)=>{
    const message = await Message.findByIdAndUpdate(req.params.messageId,{status:req.body.status});
    res.send('message status update');

})


module.exports = router;