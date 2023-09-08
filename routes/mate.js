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

router.post('/test', async (req, res) => {
    console.log('hi')
    try {
        const { myID, otherID, roomID } = req.body
        const [findRoom] = await Room.findAll({
            where: {
                roomid: roomID
            }
        })
        if (!findRoom) {
            const room = await Room.create({
                roomid: roomID,
            })
            const me = await User.findOne({
                where: {
                    userid: myID
                }
            })
            const other = await User.findOne({
                where: {
                    userid: otherID
                }
            })
            const createdRoom = await room.addUsers([me, other])
            res.json({ result: 'true', createdRoom: createdRoom })
        } else {
            res.json({ result: 'false', msg: 'user already exists in the conversation' })
        }
    } catch (error) {
        console.log(error)
    }
})

router.get('/test', async (req, res) => {
    try {
        const { myID } = req.query
        const user = await User.findOne({
            where: {
                userid: myID
            }
        })
        const arr = []
        const rooms = await user.getRooms()
        rooms.forEach(element => {
            arr.push(element.roomid)
        });

        const result = []
        for(let i = 0; i < arr.length; i++) {
            const findAllRelations = await UserRoom.findAll({
                where: {
                    roomid: arr[i]
                }
            })
            const temp = []
            for(let j = 0; j < findAllRelations.length; j++) {
                if(findAllRelations[j].userid !== myID) {
                    temp.push({roomid: findAllRelations[j].roomid ,userid: findAllRelations[j].userid})
                }
            }
            result.push(...temp)
        }
        res.json({result: true, data: result})
    } catch (error) {
        console.log(error)
        res.json({ result: false })
    }
})

router.delete('/test', (req, res) => {
    const {myID, otherID, roomID} = req.body
    try {
        const res = UserRoom.destroy({
            where: {
                userid: myID
            }
        })
    } catch (error) {
        
    }
})




module.exports = router