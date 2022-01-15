const router = require('express').Router();
const Categorie = require('../models/catrgoriesModel');
const multer = require('multer');

//multer Config
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        if(file){
            cb(null,'./uploads/images/categoriesImages');
        }
    },
    filename:(req,file,cb)=>{
        if(file){
            cb(null,new Date().toISOString()+'-'+file.originalname);
        }
    }
})

const upload = multer({storage:storage});





//get all categories
router.get('/',async(req,res)=>{
    const categories = await Categorie.find({});
    res.send(categories);
})


//add new categorie
router.post('/',upload.single('image'),async(req,res)=>{
    let category = new Categorie(req.body);
    console.log(req.file);
    if(req.file){
        category.image = req.file.path;
    }else{
        category.image = './uploads/images/noImage/png';
    }

    await category.save();
    res.send('category saved');

})


//get all parents categories
router.get('/parents',async (req,res)=>{
    const categories = await Categorie.find({parentCategorie:null});
    res.send(categories);
})


//get child categories by parent category
router.get('/child/:parent',async(req,res)=>{
    const categories  = await Categorie.find({parentCategorie:req.params.parent});
    res.send(categories);
})


//get games categories
router.get('/games',async(req,res)=>{
    const categories = await Categorie.find({parentCategorieTitle:"Games"});
    res.send(categories);
})

//get hardware categories
router.get('/hardware',async(req,res)=>{
    const categories = await Categorie.find({parentCategorieTitle:"Hardware"});
    res.send(categories);
})


//delete category 
router.delete('/:categoryId',async(req,res)=>{
    try{
        const category = await Categorie.findByIdAndRemove(req.params.categoryId);
        res.status(200).send(category.title + 'category Deleted');
    }catch(err){
        res.status(400).send('category did not delete....')
    }
})

module.exports = router;