const { Share } = require('../models')

const get_main = (req, res) => {
    // res.render('share')
    Share.findAll().then((result) => {
        console.log('result ----', result)
        if(result.length > 0) {
            res.render('share', {data: result})
        } else {
            res.render('share', {data: "hi"})
        }
    })
}

const get_User = (req, res) => {
    
}

/////////

const post_shareCommit =async (req, res) => {
    console.log('asd');
    const { userid, title, content } = req.body;
    console.log(req.body)
   const share = await Share.create({
        userid : req.body.userid,
        title : req.body.title,
        content : req.body.content
    })
    if(share){
        res.json({result:true,userid,title,content})
    }
    
    // }
}

const patch_editShare = async (req,res) => {
    console.log('asdasd')
    const { userid, title, content } = req.body;
    console.log(req.body);
    const share = await Share.update ({
        userid : req.body.userid,
        title : req.body.title,
        content : req.body.content
    }, {where : {id : req.body.id}})
    if(share){
        res.json({result:true,userid,title,content})
    }
}
const delete_share = async (req,res) => {
    console.log('asdasdasd')
    const share = await Share.destroy ({
        where: {id :req.body.id}
    })
    if(share) {
        res.json({result:true})
    }
}

////////////////////// router

// router.post('/shareCommit', (req, res) => {	
//     models.User.findOne({
//         where: {
//             userid : req.body.userid
//         }
//     })	// 글 작성
//     db.content.create({				// 게시판번호와 게시글정보를 req.body로 받아와 db에 삽입
//         userid: req.body.userid,
//         title: req.body.title,
//         content: req.body.content,
//     }).then((result) => {
//         return res.status(200).json({
//             message: '글 작성 완료!',
//         })
//     }).catch(function(err){
//         console.log(err);
//         return res.status(404).json({message: '에러뜸'});
//     })
// });


module.exports = {
    get_main,
    get_User,
    post_shareCommit,
    patch_editShare,
    delete_share
}
