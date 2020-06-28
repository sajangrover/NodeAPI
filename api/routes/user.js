const express  = require('express')
const router  = express.Router();
const User = require('../models/userModel')
const mongoose = require('mongoose')

//pasword is hashed by dcrypt library
router.post('signup' ,(req,res) =>{
    const user = new User({
        email : req.body.email,
        password : req.body.password
    })
})








module.exports = router;