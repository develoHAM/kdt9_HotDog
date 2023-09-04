const express = require("express");
const router = express.Router();

router.route("/boards")
    .get((req, res) => {
        res.send("GET //boards")
    });

router.route("/boards/sns")
    .get((req, res) => {
        res.send("GET /boards/sns");
    })
    .post((req, res) => {
        res.send("POST /boards/sns");
    });

router.get('/boards/sns/:id', (req, res) => {
    console.log('sns 와일드 카드');
});

router.route("/boards/sns/comment")
    .post((req, res) => {
        res.send("POST /boards/sns/comment");
    })
    .put((req, res) => {
        res.send("PUT /boards/sns/comment");
    })
    .delete((req, res) => {
        res.send("DELETE /boards/sns/comment");
    });

router.route("/boards/qna")
    .get((req, res) => {
        res.send("GET /boards/qna");
    })
    .post((req, res) => {
        res.send("POST /boards/qna");
    })

router.get('/boards/qna/:id', (req, res) => {
    console.log('qna 와일드 카드');
});



module.exports = router