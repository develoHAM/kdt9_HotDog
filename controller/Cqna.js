const  { Qna } = require("../models");
const jwt = require("jsonwebtoken");
const SECRET = "qwerty";

// const qna_list = async (req, res) => {
//     Qna.findAll().
// } 


//질문 users table에서 id 끌어와서 사용할수있는지?

const qna_post = async (req, res) => {
    const { title, contents, token } = req.body;
    try {
        if (!token) {
            res.json({data:false, message: "토큰 없어서 글 안쌈"});
        }

        const user = jwt.verify(token, SECRET);

        const id = user.id

        // MySQL 쿼리를 사용하여 데이터베이스에 데이터를 삽입
        const result=await Qna.create({
            title , contents, writer: id
        })

        res.json({data : result.dataValues}) 
      } catch (err) {
        console.log(err);
        res.json({data : false, message: "글 싸다가 실패"}) 
      }

    return 
}

const qna_patch = async (req, res) => {
    console.log(req.body);
}

const qna_delete = async (req, res) => {
    console.log(req.body);
}

module.exports = {
    // qna_list,
    qna_post,
};