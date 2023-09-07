const express = require('express')
const controller = require('../controller/Chospital.js')
const router = express.Router()


router.get('/',controller.get_hospital)

module.exports = router;