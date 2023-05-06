const express = require('express');
const router = express.Router();
const userController=require('../Controller/userController')
const {authMiddleware}=require('../Middleware/jwtAuth.')
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.post('/addUser',userController.addUser)
// router.post(upload.array("Photo"), userController.addUser)


module.exports=router

