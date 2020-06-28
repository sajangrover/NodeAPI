const express = require('express')
const product = require('./api/routes/product')
const order = require("./api/routes/orders")
const morgan  = require("morgan")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const app = express()


app.use(morgan("dev"))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use('/uploads' , express.static('uploads'))

mongoose.connect("mongodb+srv://sajangrover:sajan123@cluster0-cneuk.mongodb.net/test?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.Promise = global.Promise;

app.use('/products' , product)
app.use('/orders' , order)


app.use((req,res,next)=>{
    const error = new Error("Not Found")
    error.status =404

    next(error)
})
app.use((error,req,res,next)=>{
    res.status(error.status || 500)
    res.json({
        error: {
            message : error.message
        }
    })
})
// app.use( (req,res,next) =>{
//     res.json({
//         "message" : "It works fine"
//     })
// })



app.listen(4000)