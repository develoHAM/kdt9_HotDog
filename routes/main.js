const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('main');
});

router.get('/signup',(req,res)=>{
    res.render('signup');
})

router.post('/login',(req,res)=>{
    const {userid,pw}=req.body;
})
router.post('/signup',(req,res)=>{
    const {userid,pw,name,birth}=req.body;
    console.log(birth);
    if(userid!==''&&pw!==' ' &&name!==' '){
        res.json({message:true})
    }
})
module.exports=router;