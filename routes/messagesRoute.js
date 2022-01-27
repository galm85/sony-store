const router = require('express').Router();
const Message = require('../models/messagesModel');


//get all messages
router.get('/',async(req,res)=>{
    try{
        const messages = await Message.find({}).sort({createdAt:-1});
        res.status(200).send(messages);

    }catch(err){
        return res.status(400).send(err);
    }
})


//post new message
router.post('/',async(req,res)=>{
    try{

        const message = new Message(req.body);
        message.read = false;
        message.status = 'new';
        await message.save();
        return res.status(200).send('Thank for your message');
    }catch(err){
        return res.status(400).send(err);
    }
})


// delete Message by Id
router.delete('/delete-message/:messageId',async(req,res)=>{
    try {
        await Message.findByIdAndRemove(req.params.messageId);
        return res.status(200).send('Message Deleted');
    } catch (error) {
        return res.status(400).send(err);
    }
})


router.patch('/update-status/:messageId/:status',async(req,res)=>{
    const message = await Message.findByIdAndUpdate(req.params.messageId,{status:req.params.status});
    res.send('message status update');

})

router.patch('/read-message/:messageId/:read',async(req,res)=>{
    
    let read;
    if(req.params.read == 1){
        read = true;
    }else{
        read = false;
    }   
    const messageId = req.params.messageId;
    await Message.findByIdAndUpdate(messageId,{read:read});
    return res.status(200);
    
})



router.get('/search/:email',async(req,res)=>{
    try{
        const messages = await Message.find({email:{ $regex: new RegExp("^" + req.params.email.toLowerCase(), "i") } });
        return res.status(200).send(messages);
    }catch(err){
        res.status(400).send(err);
    }

})


module.exports = router;