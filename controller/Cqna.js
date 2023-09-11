const  { Qna } = require("../models");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const SECRET = process.env.login_SECRET;

const qna_list = async (req, res, next) => {
    try {
        const qna_list = await Qna.findAll();
        res.json(qna_list); 
    } catch (error) {
        console.error(err);
        next(err);
    }
} 


//질문 users table에서 id 끌어와서 사용할수있는지?

const qna_post = async (req, res) => {
    ///////
    
    const { title, contents, token } = req.body;
    try {
        if (!token) {
            res.json({data:false, message: "토큰 없어서 글 안쌈"});
        }

        const user = jwt.verify(token, SECRET);
        const id = user.userid;
        // const userid = user.userid;

        // MySQL 쿼리를 사용하여 데이터베이스에 데이터를 삽입
        const result=await Qna.create({
            title , contents, writer:id 
            // title , contents, writer: userid
        })
        res.json({data : result.dataValues}) 
      } catch (err) {
        console.log(err);
        res.json({data : false, message: "글 싸다가 실패"}) 
      }

    return 
}

const qna_patch = async (req, res) => {
    const {id,title,contents}=req.body
    console.log(id, title,contents);
    try {
        // const useredit=await Qna.update({
        //     title,contents,
        // },{where:{id}})
        // console.log(useredit);

        const edited = await Qna.update({
            title: title,
            contents: contents
        },{
            where: {
                id: id
            }
        })
        console.log('edited ====', edited)
        if(edited){
            res.json({data:true,message:"수정완료"})
        }
    } catch (err) {
        console.log(err)
    }
}

const qna_delete = async (req, res) => {
    console.log(req.body)
    const {id} = req.body;
    try {
        const contents = await Qna.destroy ({
            where: {id}
        });
        if(contents) {
            res.json({data: true})
        } else{
            res.json({ data: false, message: "ID 없음"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: false, message: '서버 오류가 발생했습니다.' });
    }
}

module.exports = {
    qna_list,
    qna_post,
    qna_patch,
    qna_delete,
};