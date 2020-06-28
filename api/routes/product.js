const express  = require('express')
const router  = express.Router();
const Product = require('../models/productModel')

const multer = require('multer')
const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,"./uploads/");
    },
    filename: function(req,file,cb){
        cb(null,Date.now()+file.originalname)
    }
})
const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true)
    }
    else{
        cb(null,false)
    }

}
const upload = multer({storage:storage,
    limits : {
        fileSize : 1024*1024*10
    },
    fileFilter : fileFilter
})

router.get('/',(req,res)=>{
    Product.find()
        .select("name price productImage _id")
        .exec()
        .then(docs =>{
            const response = {
                count : docs.length,
                products : docs
            }
            res.status(200).json(response)
        })
        .catch( err=>{
            res.status(500).json({error : err})
        })
})
router.post('/',upload.single('productImage'),(req,res)=>{
    
    console.log(req.file)
    const product  = new Product({
        name : req.body.name,
        price : req.body.price,
        productImage : req.file.path
    })

    product.save().then(result =>{
        console.log(result)
        res.status(200).json({
            message : "Product succesfully added",
            product : product
        })
    })
    .catch(err => {
        console.log(err),
        res.status(500).json({error : err})
    });
   
})
router.get('/:productId',(req,res)=>{
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc =>{
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json({error : err})
        })
})
router.patch('/:productId',(req,res)=>{
    const id = req.params.productId
    const updateOps =req.body

    // for(const ops of req.body){
    //     updateOps[ops.propName] = ops.value;
    // }

    Product.update({_id:id},{$set : updateOps})
        .exec()
        .then(result =>{
            res.status(200).json(result)
        })
        .catch(err =>{
            res.status(500).json({error :err})
        })

})
router.delete('/:productId',(req,res)=>{
    const id = req.params.productId

    Product.remove({_id:id})
        .exec()
        .then(result =>{
            res.status(200).json(result)
        })
        .catch(err=>{
            res.status(500).json({error : err})
        })
})

module.exports = router;