const express = require('express');
const router = express.Router();
const userController=require('../Controller/userController')
const {authMiddleware}=require('../Middleware/jwtAuth.')

router.post('/addUser',userController.addUser)

module.exports=router

