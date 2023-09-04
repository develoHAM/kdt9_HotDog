const express = require('express')
const router = express.Router()
const controller=require('../controller/Cuser')
router.get('/', controller.main);

router.get('/signup',controller.get_signup);

router.post('/login',controller.post_signin)
router.post('/signup',controller.post_signup)
module.exports=router;