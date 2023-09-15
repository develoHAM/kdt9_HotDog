const { Share } = require('../models')
const { User } = require('../models')
const { ShareComments } = require('../models')
const jwt = require("jsonwebtoken");
const SECRET = process.env.login_SECRET;


const get_main = (req, res) => {
  // 토큰 추출 (예시)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  Share.findAll().then((result) => {
    if (result.length > 0) {
      // data와 함께 writer와 token도 전달
      // res.render('share', {data : result + '반갑습니다.', writer: '작성자ID_here', token: token })
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


async function post_shareCommit(req, res) {
    try {
      console.log("옴")
      const { title, content, token } = req.body;
      const user = jwt.verify(token, SECRET);
      const id = user.userid;

      const dynamic_file = req.file ? req.file.location : null; // 파일 업로드 처리
  
      const now = new Date();
      const formattedCreatedAt = now.toISOString();

      const newShare = await Share.create({ title, content, dynamic_file, 
        writer:id , createdAt: formattedCreatedAt});
      res.status(201).json(newShare);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '글 작성 실패' });
    }
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

const patch_editShare = async (req, res) => {
  console.log('asdasd');
  const { id, userid, title, content } = req.body;
  console.log(req.body);
  try {
    const share = await Share.update(
      {
        title: title,
        content: content,
      },
      { where: { id: id } }
    );
    if (share[0] === 1) {
      // Check if exactly 1 row was updated
      res.json({ result: true, id, title, content });
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
    const {id} = req.body;
    const share = await Share.destroy ({
        where: {id :req.body.id}
    })
    if(share) {
        res.json({result:true})
    }
}

async function post_createComment(req, res) {
  try {
    console.log('post_createComment has been called');
    console.log('Request body:', req.body);  // Log 추가

    const { comment, token } = req.body; 

    const postId = req.params.postId;

    if (!token) {
      return res.status(400).json({ error: '토큰이 없습니다.' });
    }

    const user = jwt.verify(token, SECRET);
    const id = user.userid

    // if (!comment || !postId || !user) {
    //   return res.status(400).json({ error: '못합니다.' });
    // }

    // const writer = user.userid;
    const newComment = await ShareComments.create({ comment, writer:id, postId });
    res.status(201).json(newComment);
  } catch (error) {
    console.error('An error occurred:', error);  // 로그 추가
    res.status(500).json({ error: 'Failed to write comment' });
  }
}


async function deleteComment(req, res) {
  try {
    const commentId = req.params.commentId;
    const user = jwt.verify(req.body.token, SECRET);
    const writer = user.userid;
    
    const comment = await ShareComments.findOne({ where: { id: commentId } });
    
    if (comment.writer !== writer) {
      return res.status(403).json({ error: '작성자만 댓글을 삭제할 수 있습니다.' });
    }
    
    await Comment.destroy({ where: { id: commentId, writer, postId } });
    
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
    post_createComment,
    deleteComment
}