const router = require('express').Router();
const Comment = require('../models/commentsModel');



//get all articles
router.get('/',async(req,res)=>{
    
    try{
        const comments = await Comment.find({});
        return res.status(200).send(comments);
    }catch(err){
        return res.status(400).send(err);
    }
})


//get comments by article id
router.get('/get-by-article/:articleId',async(req,res)=>{
    try{
        const comments = await Comment.find({articleId:req.params.articleId}).sort({createdAt:-1});
        return res.status(200).send(comments);
    }catch(err){
        return res.status(400).send(err);
    }
})

//get comments by user id
router.get('/get-by-user/:userId',async(req,res)=>{
    try{
        const comments = await Comment.find({userId:req.params.userId});
        return res.status(200).send(comments);
    }catch(err){
        return res.status(400).send(err);
    }
})



//add new comment
router.post('/',async(req,res)=>{
    try{
        let comment = new Comment(req.body);
        await comment.save();
        return res.status(200).send('Comment Saved');
    }catch(err){
        return res.status(400).send(err)
    }
})


// delete Comment
router.delete('/delete-comment/:commentId',async (req,res)=>{
    try{
        await Comment.findByIdAndRemove(req.params.commentId);
        return res.status(200).send('comment deleted');

    }catch(err){
        return res.status(400).send(err);
    }
})







module.exports = router;