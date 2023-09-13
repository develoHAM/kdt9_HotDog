const express = require('express')
const controller=require('../controller/Cuser')

const router = express.Router()

// 메인페이지
router.get('/', controller.main);
//FAQ페이지
router.get('/faq',controller.faq)
// 회원가입 페이지
router.get('/signup',controller.get_signup);
// 로그인
router.post('/login',controller.post_signin);
// 마이페이지
router.get('/mypage',controller.get_mypage);
// 마이페이지 수정
router.post('/mypage',controller.post_mypage);
router.patch('/mypage',controller.mypage);
// 회원가입
router.post('/signup',controller.post_signup);
// 회원삭제
router.delete('/delete',controller.delete_user);

module.exports=router;