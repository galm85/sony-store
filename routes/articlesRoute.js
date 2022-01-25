const router = require('express').Router();
const Article = require('../models/articlesModel');
const multer = require('multer');

//multer Config
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        if(file){
            cb(null,'./uploads/images/articlesImages');
        }
    },
    filename:(req,file,cb)=>{
        if(file){
            cb(null,new Date().toISOString()+'-'+file.originalname);
        }
    }
})

const upload = multer({storage:storage});





//get all articles
router.get('/',async(req,res)=>{
    
    try{
        const articles = await Article.find({});
        return res.status(200).send(articles);
    }catch(err){
        return res.status(400).send(err);
    }
})


//get only posted articles
router.get('/posted',async(req,res)=>{
    try{
        const articles = await Article.find({status:'post'});
        return res.status(200).send(articles);
    }catch(err){
        return res.status(400).send(err);
    }
})



//add new article
router.post('/',upload.single('image'),async(req,res)=>{
    try{
        let article = new Article(req.body);
        if(req.file){
            article.image = req.file.path;
        }else{
            article.image = './uploads/images/noImage/png';
        }
        
        await article.save();
        res.status(200).send('article saved');
    }catch(err){
        res.status(400).send(err);
    }

})





//delete article 
router.delete('/:articleId',async(req,res)=>{
    try{
        const article = await Article.findByIdAndRemove(req.params.articleId);
        res.status(200).send('article deleted');
    }catch(err){
        res.status(400).send(err);
    }
})


//update product
router.patch('/update-article/:articleId',upload.single('image'),async(req,res)=>{
    
    try {
      if(req.file){
          let article = req.body;
          article.image = req.file.path;
          await Article.findByIdAndUpdate(req.params.articleId,article);
          if(article.status == 'post'){
              return res.status(200).send('Article Updated and Posted');
            }else{
              return res.status(200).send('Article Updated and saved to drafts');
          }
      }
      
      await Article.findByIdAndUpdate(req.params.articleId,req.body);
        if(req.body.status == 'post'){
            return res.status(200).send('Article Updated and Posted');
        }else{
            return res.status(200).send('Article Updated and saved to drafts');
        }
    } catch(err){
        res.status(400).send(err);
    }
})


// delete product
router.delete('/delete/:productId',async(req,res)=>{
    const product = await Product.findByIdAndRemove(req.params.productId);
    res.status(200).send(product.title + ' deleted');

})


// add/reduce like to article
router.patch('/likes/:articleId/:op',async(req,res)=>{
    try{
        let op = req.params.op;
        let article = await Article.findById(req.params.articleId);
        if(op === 'like'){
            article.likes = article.likes+1;
        }else{
            article.likes = article.likes-1;
        }
        await Article.findByIdAndUpdate(req.params.articleId,article);
        return res.status(200).send(op);


    }catch(err){
        return res.status(400).send(err.response.data)
    }
})


//getSingleArticle
router.get('/single-article/:articleId',async(req,res)=>{
    try{
        const article = await Article.findById(req.params.articleId);
        return res.status(200).send(article);
    }catch(err){
        return res.status(400).send(err)
    }
})




module.exports = router;