const express = require("express");
const router = express.Router();
const controller = require("../controller/Cqna")
// const {qnaWrite}=require('../models')
const { Qna, Comment } = require('../models')

router.route("/")
    .get((req, res) => {
        res.render("boards")
    });


router.route("/verify")
    .post((req, res) => {
        controller.user_verify(req, res);
    })

router.route("/qna")
    .get(async (req, res) => {
        const data = await Qna.findAll()
        // console.log('data ====', data)
        res.render("qnaList", { data });
    })
    .post((req, res) => {
        controller.qna_post(req, res);
    })

router.route("/qna/write")
    .get((req, res) => {
        res.render("qnawrite");
    })

router.route("/qna/:id")
    .get(async (req, res) => {
        const { id } = req.params
        const result = await Qna.findOne({
            where: { id: id, }
        })
  


        res.render("qnaDetail", { data: result, });
    }).patch(async (req, res) => {
        controller.qna_patch(req, res);
    }).delete(async (req, res) => {
        controller.qna_delete(req, res);
    })

// router.route("/comment")
//     .get(async (req, res) => {
//         try {

//             const comment = await Comment.findAll({where:{boardtype}});
//             // commenter : req.body.writerid,
//             // comment: req.body.content,
//             res.json(comment)

//         } catch (error) {
//             console.error(error);
//         }
//     })

    router.get("/comment/:id", controller.get_comment)
    router.post('/list',controller.comment_list);
    router.post('/register',controller.comment_register);
    router.post('/comment',controller.comment_comment)
    router.post("/memory", controller.comment_memory)

module.exports = router;