const express = require('express')
const controller = require('../controller/Cmate.js')
const router = express.Router()

const { User, Room, UserRoom } = require('../models')

router.get('/', controller.get_main)

router.post('/verify', controller.post_verify)



module.exports = router