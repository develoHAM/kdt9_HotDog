const bcrypt=require('bcrypt');
const {User}=require('../models');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const SECRET=process.env.login_SECRET;
const round=Number(process.env.hashRound);

const cookieConfig={
    httpOnly:true,
    maxAge:60*1000,
}
const main=(req, res) => {
    res.render('main');
}
const faq=(req,res)=>{
    res.render('FAQ')
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
    if(userid===''||pw==="" || name==="" || birth==="" || phonenumber==="" || address==="" || dogname==="" || rfid===""){
        res.json({flag:'1',message:'모든항목을 입력해주세요'})
        return;
    }
    try {
        const userExist =await User.findOne({where:{userid:userid}})
        if(userExist){
            res.json({flag:'2',message:'ID가 중복이됩니다!'})
            return;
        } else {
            const hash=await bcryptPassword(pw);
            const user =await User.create({
                userid,
                pw:hash,
                name,
                birth,
                phonenumber,
                address,
                dogname,
                RFIDcode:rfid,
            })
            if(user){
                res.json({flag:"3", message:'회원가입을 축하드립니다'});
            }
        }
    } catch (error) {
        console.log(error);
    }
    
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
            const token=jwt.sign({name:user.name,id:user.id,userid:user.userid},SECRET,{expiresIn: '24h'});
            // res.cookie('isLogin', true,cookieConfig);
            // res.cookie('logintoken',token);
            res.json({ result: true, userinfo: user, token });
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
    if(!token) {
        res.json({result: false})
        return;
    }
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
        console.log(result.id)
        const {id,userid,pw,name,birth,phonenumber,address,dogname,RFIDcode}=result;
        res.json({result: true,id,userid,pw,name,birth,phonenumber,address,dogname,RFIDcode})        
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

const delete_user=async(req,res)=>{
    console.log(req.body);
    const {id}=req.body;
    const user=User.destroy({
        where:{id},
    })
    if(user){
        res.json({data:true})
    }
}







module.exports={
    main,
    faq,
    get_signup,
    post_signup,
    post_signin,
    get_mypage,
    post_mypage,
    mypage,
    delete_user
}

const bcryptPassword=(password)=>bcrypt.hash(password,round);
const compareFunc=(password,dbpass)=>bcrypt.compare(password,dbpass)