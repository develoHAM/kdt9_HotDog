const express = require('express')
const controller = require('../controller/Cshare.js')
const router = express.Router()

router.get('/', controller.get_main)
router.get('/user', controller.get_User)
router.post('/shareCommit', controller.post_shareCommit)
router.patch('/edit', controller.patch_editShare)
router.delete('/delete', controller.delete_share)

module.exports = router;