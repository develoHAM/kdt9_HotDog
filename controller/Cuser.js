const bcrypt=require('bcrypt');
const {User, RFID}=require('../models');
const main=(req, res) => {
    res.render('main');
}
const get_signup=(req,res)=>{
    res.render('signup');
}
const post_signup=async (req,res)=>{
    console.log("check")
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
const post_signin= async (req,res)=>{
    const {userid,pw}=req.body;
    const user= await User.findOne({
        where:{userid}
    });
    if(user){
        const result= await compareFunc(pw,user.pw);
        console.log(result);
        if(result){
            res.json({result:true, data:user})
        }else{
            res.json({result:false,message:'비밀번호가 틀렸습니다!'})
        }
    }else{
        res.json({result:false , message:'존재하는 사용자가 없습니다.'})
    }
    console.log('user',user);
}















module.exports={
    main,
    get_signup,
    post_signup,
    post_signin
}

const bcryptPassword=(password)=>bcrypt.hash(password,11);
const compareFunc=(password,dbpass)=>bcrypt.compare(password,dbpass)