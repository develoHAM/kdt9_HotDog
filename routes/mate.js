const express = require('express')
const controller = require('../controller/Cmate.js')
const router = express.Router()

const { User, Room, UserRoom } = require('../models')

router.get('/', controller.get_main)

router.post('/verify', controller.post_verify)

router.post('/testUser', async (req, res) => {
    const { userid, pw, name, birth, phonenumber, address, dogname, RFIDcode } = req.body
    const result = await User.create({
        userid,
        pw,
        name,
        birth,
        phonenumber,
        address,
        dogname,
        RFIDcode,
    })
    res.json({ result: true, userinfo: result })
})

router.post('/testRoom', async (req, res) => {
    const { roomid } = req.body
    const result = await Room.create({
        roomid
    })
    res.json({ result: true, roominfo: result })
})

router.post('/testUserRoom', async (req, res) => {
    const { userid, otherid, roomid } = req.body
    try {
        const myID = await UserRoom.create({
            userid,
            roomid
        })
        const otherID = await UserRoom.create({
            userid: otherid,
            roomid
        })
        res.json({ result: true, userRoomInfo: { myID: myID, otherID: otherID } })
    } catch (error) {
        console.log(error)
        res.json({ result: false })
    }
})

router.get('/test', async (req, res) => {
    try {
        const result = await UserRoom.findAll({
        })
        res.json({ result: true, info: result })
    } catch (error) {
        console.log(error)
        res.json({ result: false, err: error })
    }
})

router.post('/test', async (req, res) => {
    try {
        const {myID, otherID, roomID} = req.body
        const user = await User.findOne({
            where: {
                userid: myID
            }
        })

        const rooms = await user.getRooms();
        console.log('rooms ====', rooms)
        res.json({result: true, rooms})
    } catch (error) {
        console.log('error ========', error)
        res.json({result: false})
    }
})



module.exports = router