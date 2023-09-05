const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('main');
});
const controller=require('../controller/Cuser')
router.get('/', controller.main);
router.get('/signup',controller.get_signup);
router.post('/login',controller.post_signin);
router.get('/mypage',controller.get_mypage);
router.post('/mypage',controller.post_mypage);
router.patch('/mypage',controller.mypage);
router.post('/signup',controller.post_signup)
module.exports=router;