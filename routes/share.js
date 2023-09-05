const express = require('express')
const controller = require('../controller/Cshare.js')
const router = express.Router()

router.get('/', controller.get_main)

router.post('/shareCommit', controller.get_shareCommit)

module.exports = router;