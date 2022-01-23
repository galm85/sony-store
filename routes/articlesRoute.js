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
    console.log('articles');
    try{
        const articles = await Article.find({});
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
router.patch('/update-product/:productId',upload.single('image'),async(req,res)=>{
    try {
      if(req.file){
          let product = req.body;
          product.image = req.file.path;
          const response = await Product.findByIdAndUpdate(req.params.productId,product);
          return res.status(200).send({message:response.title+' updated',product:product});
      }
      const response = await Product.findByIdAndUpdate(req.params.productId,req.body);
          return res.status(200).send(response.title+' updated');

    } catch(err){
        res.status(400).send(err);
    }
})


// delete product
router.delete('/delete/:productId',async(req,res)=>{
    const product = await Product.findByIdAndRemove(req.params.productId);
    res.status(200).send(product.title + ' deleted');

})


//update selles
router.patch('/update-sells/:productId',async(req,res)=>{
    let {sells} = await Product.findById(req.params.productId);
    sells = sells + req.body.amount;
    await Product.findByIdAndUpdate(req.params.productId,{sells:sells});
    res.status(200).send('sells update');
})


// get best sellers games
router.get('/best-sells/games',async(req,res)=>{
    const products = await Product.find({}).sort({'sells':-1}).limit(4);
    res.send(products);
})


//get new games
router.get('/new-games/games',async(req,res)=>{
    const products = await Product.find({newGame:true}).sort({'createdAt':-1}).limit(4);
    res.send(products);
})


//get coming soon games
router.get('/coming-soon/games',async(req,res)=>{
    const products = await Product.find({comingSoon:true}).sort({'createdAt':-1}).limit(4);
    res.send(products);
})


//search product by name
router.get('/search/:productName',async(req,res)=>{
    const products = await Product.find({title:{ $regex: new RegExp("^" + req.params.productName.toLowerCase(), "i") } });
    // const products = await Product.find({"title":/req.params.productName/i },function(err,docs){});
    return res.status(200).send(products);

})


module.exports = router;