const express = require('express')
const controller = require('../controller/Cmate.js')
const router = express.Router()

router.get('/', controller.get_main)

router.post('/match', controller.post_match)

module.exports = router