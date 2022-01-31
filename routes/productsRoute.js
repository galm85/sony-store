const router = require('express').Router();
const Product = require('../models/productsModel');
const multer = require('multer');

//multer Config
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        if(file){
            cb(null,'./uploads/images/productsImages');
        }
    },
    filename:(req,file,cb)=>{
        if(file){
            cb(null,new Date().toISOString()+'-'+file.originalname);
        }
    }
})

const upload = multer({storage:storage});





//get all products
router.get('/',async(req,res)=>{
    const products = await Product.find({});
    res.send(products);
})


//add new Product

router.post('/',upload.single('image'),async(req,res)=>{
    try{
        let product = new Product(req.body);
        if(req.file){
            product.image = req.file.path;
        }else{
            product.image = './uploads/images/noImage/png';
        }
        
        await product.save();
        res.send('product saved');
    }catch(err){
        res.status(400).send(err);
    }

})


//get all product by category
router.get('/:category',async (req,res)=>{
    const products = await Product.find({categorie:req.params.category});
    res.send(products);
})


//delete product 
router.delete('/:productId',async(req,res)=>{
    try{
        const product = await Product.findByIdAndRemove(req.params.productId);
        res.status(200).send(product);
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


//get Product by id
router.get('/product-by-id/:productId',async(req,res)=>{
    const product = await Product.findById(req.params.productId);
    return res.status(200).send(product);
})


module.exports = router;