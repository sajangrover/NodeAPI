const express  = require('express')
const router  = express.Router();
const Order = require('../models/orderModel')
const Product = require('../models/productModel')


router.get('/',(req,res)=>{
    Order.find()
        .select("_id product quantity")
        .populate('product' ,'name price')
        .then(docs => {
            res.status(200).json({
                count : docs.length,
                orders : docs.map(doc=>{
                  return{
                    _id :doc._id,
                    product : doc.product,
                    quantity :doc.quantity,
                    url : 'http://localhost:4000/orders/'+doc._id
                  }
                })
            })
        })
        .catch(err =>{
            res.status(500).json({error :err})
        })
   
})
router.post('/',(req,res)=>{

    Product.findById(req.body.productId)
        .then(product =>{
            if(!product){
                res.status(404).json({
                    message : "product not found"
                })
            }
            const order = new Order({
                product :req.body.productId,
                quantity : req.body.quantity
            })
            return order.save();
        })
        .then(result =>{
            res.status(200).json(result)
        })
        .catch(err=>{
            res.status(500).json({error : err})
        })

    

    // order.save()
    //     .then(result =>{
    //         res.status(200).json(result)
    //     })
    //     .catch(err=>{
    //         res.status(500).json({error : err})
    //     })
})
router.get('/:orderId',(req,res)=>{

    Order.findById(req.params.orderId)
        .select("_id product quantity")
        .populate('product' ,'name price')
        .then(doc =>{
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json({error : err})
        })
})
router.delete('/:orderId',(req,res)=>{
    Order.remove({_id:req.params.orderId})
        .then(result =>{
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error : err})
        })
})

module.exports = router;