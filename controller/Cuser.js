const bcrypt=require('bcrypt');
const {User, RFID}=require('../models');
const jwt=require('jsonwebtoken');
const SECRET='qwerty';

const cookieConfig={
    httpOnly:true,
    maxAge:60*1000,
}
const main=(req, res) => {
    res.render('main');
}
const get_signup=(req,res)=>{
    res.render('signup');
}
const get_mypage=(req,res)=>{
    res.render('mypage');
};
//회원가입
const post_signup=async (req,res)=>{
    const {userid,pw,name,birth,phonenumber,address,dogname,rfid}=req.body;
    console.log(req.body)
    const hash=await bcryptPassword(pw);
    User.create({
        userid,
        pw:hash,
        name,
        birth,
        phonenumber,
        address,
        dogname,
        RFIDcode:rfid,
        // RFID:  {
        //     rfid,
        //     dogregnumber,
        //     ownername,
        //     ownerbirth
        // },
        // include:[{model:RFID}]
    }).then(()=>{
        res.json({result:true});
    })
}
//로그인
const post_signin= async (req,res)=>{
    const { userid, pw } = req.body;
    const user = await User.findOne({
        where: { userid },
    });
    if (user) {
        const result = await compareFunc(pw, user.pw);
        console.log('result', result);
        if (result) {
            const token=jwt.sign({name:user.name,id:user.id},SECRET);
            // res.cookie('isLogin', true,cookieConfig);
            res.cookie('logintoken',token);
            res.json({ result: true, data: user, token });
        } else {
            res.json({ result: false, message: '비밀번호가 틀렸습니다.' });
        }
    } else {
        res.json({ result: false, message: '존재하는 사용자가 없습니다' });
    }
}
//마이페이지
const post_mypage=async (req,res)=>{
    console.log('req.body', req.body)
    const token = req.body.token
    const user = await jwt.verify(token, SECRET)
        // (err, decoded) => {
        // if (err) {
        //     console.log(err)
        //     return;
        // }
        // return decoded.id
        // console.log('decoded token ====', decoded)
    User.findOne({
        where: {
            id: user.id
        }
    }).then((result) => {
        const {id,userid,pw,name,birth,phonenumber,address,dogname,RFIDcode}=result;
        res.json({id,userid,pw,name,birth,phonenumber,address,dogname,RFIDcode})        
    })
}
const mypage=async(req,res)=>{
    const {id,userid,pw,name,birth,phonenumber,address,dogname,RFIDcode}=req.body;
    console.log(req.headers);
    const [bearer,token]=req.headers.authorization.split(' ');
    if(bearer ==="Bearer"){
        try {
            const result= jwt.verify(token,SECRET)
            console.log(result);
           const returnValue=await User.findOne({where:{id:result.id}});
           if(returnValue){
               const hash = await bcryptPassword(pw);
               User.update({userid, name, pw:hash,birth,phonenumber,address,dogname,RFIDcode }, { where: { id:returnValue.id } }).then(() => {
                   res.json({ result: true });
               });
           }
        } catch (error) {

            console.log(error);
            res.json({result:false,message:'인증에 실패하였습니다'})
        }
    }else{
        res.json({result:false,message:'잘못된 인증방식 입니다.'})
    }
}















module.exports={
    main,
    get_signup,
    post_signup,
    post_signin,
    get_mypage,
    post_mypage,
    mypage,
}

const bcryptPassword=(password)=>bcrypt.hash(password,11);
const compareFunc=(password,dbpass)=>bcrypt.compare(password,dbpass)