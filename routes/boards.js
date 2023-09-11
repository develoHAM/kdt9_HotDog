const express = require("express");
const router = express.Router();
const controller = require("../controller/Cqna")
// const {qnaWrite}=require('../models')
const { Qna } = require('../models')

router.route("/")
    .get((req, res) => {
        res.render("boards")
    });

router.route("/sns")
    .get((req, res) => {
        res.send("GET /boards/sns");
    })
    .post((req, res) => {
        res.send("POST /boards/sns");
    });

// router.route("/sns/comment")
//     .post((req, res) => {
//         res.send("POST /boards/sns/comment");
//     })
//     .put((req, res) => {
//         res.send("PUT /boards/sns/comment");
//     })
//     .delete((req, res) => {
//         res.send("DELETE /boards/sns/comment");
//     });

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
    const {id}=req.params
    const result = await Qna.findOne({
        where:{id: id}
    })
    res.render("qnaDetail",{data:result});
}).delete(async (req, res) => {
    controller.qna_delete(req, res);
})






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

// router.get('/sns/:id', (req, res) => {
//     console.log('sns 매개변수');
// });

// router.get('/qna/:id', (req, res) => {
//     console.log('qna 매개변수');
// });

module.exports = router;