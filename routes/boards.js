const express = require("express");
const router = express.Router();
const controller = require("../controller/Cqna")
// const {qnaWrite}=require('../models')
const { Qna } = require('../models')

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
            where: { id: id }
        })
        res.render("qnaDetail", { data: result });
    }).patch(async (req, res) => {
        controller.qna_patch(req, res);
    }).delete(async (req, res) => {
        controller.qna_delete(req, res);
    })

    router.post('/list',controller.comment_list);
    router.post('/register',controller.comment_register);
    router.post('/comment',controller.comment_comment)
    router.post("/memory", controller.comment_memory)
// router.route("/qna/comment")
//     .post((req, res) => {
//         res.send("POST /boards/qna/comment");
//     })
//     .put((req, res) => {
//         res.send("PUT /boards/qna/comment");
//     })
//     .delete((req, res) => {
//         res.send("DELETE /boards/qna/comment");
//     });

// router.get('/qna/:id', (req, res) => {
//     console.log('qna 매개변수');
// });

module.exports = router;