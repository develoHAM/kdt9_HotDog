const { Share } = require('../models')
const { User } = require('../models')
const jwt = require("jsonwebtoken");
const SECRET = process.env.login_SECRET;

const get_main = (req, res) => {
  // 토큰 추출 (예시)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  Share.findAll().then((result) => {
    if (result.length > 0) {
      // data와 함께 writer와 token도 전달
      res.render('share', { data: result, writer: '작성자ID_here', token: token });
      console.log("Token from request body:", req.body.token);

    } else {
      res.render('share', { data: "hi", writer: '작성자ID_here', token: token });
    }
  }).catch(err => {
    console.log(err);
    res.status(500).send('Internal Server Error');
  });
};

const get_User = (req, res) => {
    
}
const user_verify = async (req ,res) => {
  const { token, writer } = req.body;
  try {
    const decoded = jwt.verify(token, SECRET);
    const userId = decoded.userid;
    if(userId === writer) {
      res.json({ data: true });
  }
  return res.json({ data: false, message: '본인 게시물만 수정 가능' });

  } catch (error) {
    return res.status(500).json({ data: false, message: 'Internal Server Error' });
  }
}


// const user_verify = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const token = req.headers.authorization.split(' ')[1]; // "Bearer [토큰]" 형식에서 토큰만 추출
//     const decoded = jwt.verify(token, SECRET);
//     const userId = decoded.userid;

//     const result = await Share.findOne({
//       where: { id },
//       include: [{ model: User, attributes: ['userid'] }]
//     });

//     const writer = userId === result.User.userid ? true : false;

//     res.render('share', {
//       data: result,
//       writer
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// };


// const user_verify = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const token = req.headers.authorization.split(' ')[1]; // "Bearer [토큰]" 형식에서 토큰만 추출
//     const decoded = jwt.verify(token, SECRET);
//     const userId = decoded.userid;

//     const result = await Share.findOne({
//       where: { id },
//       include: [{ model: User, attributes: ['userid'] }]
//     });

//     const writer = userId === result.User.userid ? true : false;

//     res.render('share', {
//       data: result,
//       writer
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// };
/////////

async function post_shareCommit(req, res) {
    try {
      console.log("옴")
      const { userid, title, content, token } = req.body;
      const user = jwt.verify(token, SECRET);
      const id = user.userid;

      const dynamic_file = req.file ? req.file.location : null; // 파일 업로드 처리
  
      const now = new Date();
      const formattedCreatedAt = now.toISOString();

      const newShare = await Share.create({ userid, title, content, dynamic_file, 
        writer:id , createdAt: formattedCreatedAt});
      res.status(201).json(newShare);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '글 작성 실패' });
    }
  }

// const patch_editShare = async (req,res) => {
//     console.log('asdasd')
//     const { userid, title, content } = req.body;
//     console.log(req.body);
//     const share = await Share.update ({
//         userid : req.body.userid,
//         title : req.body.title,
//         content : req.body.content
//     }, {where : {id : req.body.id}})
//     if(share){
//         res.json({result:true,userid,title,content})
//     }
// }
const patch_editShare = async (req, res) => {
  console.log('asdasd');
  const { id, userid, title, content } = req.body;
  console.log(req.body);
  try {
    const share = await Share.update(
      {
        userid: userid,
        title: title,
        content: content,
      },
      { where: { id: id } }
    );
    if (share[0] === 1) {
      // Check if exactly 1 row was updated
      res.json({ result: true, id, userid, title, content });
    } else {
      res.json({ result: false, message: '수정에 실패했습니다.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ result: false, message: '서버 오류 발생' });
  }
};


const delete_share = async (req,res) => {
    console.log('asdasdasd')
    const share = await Share.destroy ({
        where: {id :req.body.id}
    })
    if(share) {
        res.json({result:true})
    }
}


async function createComment(req, res) {
  try {
    const { content, token, postId } = req.body;
    const user = jwt.verify(token, SECRET);
    const writer = user.userid;

    const newComment = await Comment.create({ content, writer, postId });
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '댓글 작성 실패' });
  }
}

async function deleteComment(req, res) {
  try {
    const commentId = req.params.commentId;
    const user = jwt.verify(req.body.token, 'your_secret_key');
    const writer = user.userid;
    
    const comment = await Comment.findOne({ where: { id: commentId } });
    
    if (comment.writer !== writer) {
      return res.status(403).json({ error: '작성자만 댓글을 삭제할 수 있습니다.' });
    }
    
    await Comment.destroy({ where: { id: commentId, writer, postId: comment.postId } });
    
    res.status(200).json({ message: '댓글 삭제 성공' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '댓글 삭제 실패' });
  }
}


module.exports = {
    get_main,
    get_User,
    user_verify,
    post_shareCommit,
    patch_editShare,
    delete_share,
    createComment,
    deleteComment
}