const express = require('express')
const controller = require('../controller/Cmate.js')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');


const { User, Room, UserRoom, Chat } = require('../models')
const { Op } = require('sequelize')

router.get('/', controller.get_main)

router.post('/verify', controller.post_verify)

//회원가입
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

//방 이름이 존재하는지 조회, 있다면 첫번째 인자로 반환, 없다면 생성 후 두번째 인자로 생성된 row 반환
router.post('/test', async (req, res) => {
    try {
        const { myID, otherID, roomID } = req.body
        const [room, created] = await Room.findOrCreate({
            where: {
                roomid: roomID
            }
        })
        if (created) {
            const me = await User.findOne({ where: { userid: myID } })
            const other = await User.findOne({ where: { userid: otherID } })
            const createdRoom = await room.addUsers([me, other])
            res.json({ result: true, createdRoom: createdRoom })
        } else {
            res.json({ result: false, alreadyExists: room })
        }
    } catch (error) {
        console.log(error)
    }
})

//회원의 userid를 받아서 해당 회원이 속해있는 방들의 방 번호와 해당 방번호에 속해있는 상대방의 userid를 객체 배열로 반환
router.get('/test', async (req, res) => {
    try {
        const { myID } = req.query
        const result = await User.findOne({
            where: {
                userid: myID
            },
            include: [{
                model: Room,
                include: [{
                    model: User
                }]
            }]
        })

        const data = result.rooms.map((room) => {
            const arr = []
            room.users.forEach((user) => {
                if (user.users_rooms.userid !== myID) {
                    arr.push({ roomid: user.users_rooms.roomid, userid: user.users_rooms.userid })
                }
            })
            return arr;
        })
        console.log('result', data)
        res.json({ result: true, info: data })
    } catch (error) {
        console.log(error)
        res.json({ result: false })
    }
})

//회원의 userid와 나가고자 하는 방 'roomid'를 받아서 우선 참조테이블에서 나가고자 하는 방에 다른 사람이 있는지 확인후 결과를 stillSomeoneInRoom에 저장, 그다음 참조테이블에서 내 'userid'와 내가 나가고자 하는 방의 'roomid'를 모두 포함한 특정 row를 삭제, 그다음 만약 stillSomeoneInRoom에 값이 없다면 (나가고자 하는 방에 다른사람이 남아있지 않은 상태라면) room테이블에서 해당 'roomid'를 가지고 있는 row도 삭제. 만약 누군가가 남아있다면 room테이블은 그대로 넵둔다.
router.delete('/test', async (req, res) => {
    try {
        const { myID, roomID } = req.body
        const me = await User.findOne({ where: { userid: myID } })
        const room = await Room.findOne({ where: { roomid: roomID } })
        const [stillSomeoneInRoom] = await UserRoom.findAll({
            where: {
                [Op.and]: [
                    { roomid: roomID },
                    { userid: { [Op.ne]: myID } }
                ]
            }
        })
        const result = await me.removeRoom(room)
        if (!stillSomeoneInRoom) {
            const destroyRoom = Room.destroy({
                where: { roomid: roomID }
            })
        }
        console.log('stillSomeoneInRoom', stillSomeoneInRoom)
        console.log('result', result)
        res.json({ result })
    } catch (error) {
        console.log(error)
        res.json({ result: false })
    }
})

router.get('/testChatRoom', async (req, res) => {
    try {
        const { myID, otherID, otherSocketID } = req.query
        const data = await Room.findAll({
            include: [
                {
                    model: User,
                    where: {
                        userid: { [Op.in]: [myID, otherID] },
                    }
                }
            ]
        })
        const result = []
        data.forEach((room) => {
            if (room.users.length > 1) {
                const temp = []
                room.users.forEach((user) => {
                    temp.push({ roomid: user.users_rooms.roomid, userid: user.users_rooms.userid })
                })
                result.push(temp)
            }
        })
        if (result.length > 0) {

            const [room] = result
            const privateRoomName = room[0].roomid
            res.send({ result: privateRoomName })
        } else {
            res.send({ result: 'they are not in room' })
        }
    } catch (error) {
        console.log(error)
        res.send({ result: 'error' })
    }
})

router.get('/getChatList', async (req, res) => {
    try {
        const { myID, otherID, otherSocketID } = req.query
        const privateRoomName = uuidv4();
        const usersToCheck = [myID, otherID]
        const rooms = await Room.findAll({
            attributes: ['roomid'],
            include: [{
                model: User,
                attributes: ['userid'],
                where: {
                    userid: { [Op.in]: usersToCheck }
                },
                through: {
                    attributes: []
                }
            }]
        })
        // rooms => [{ roomid: '', users: [{userid:''}, {userid:''}] }, ...]

        const areBothUsersInRooms = rooms.map((room) => {
            const users = room.users.map((user) => {
                return user.userid
            })
            if (users.includes(myID) && users.includes(otherID)) {
                return room.roomid
            } else {
                return false
            }
        })

        const result = areBothUsersInRooms.filter((result) => {
            return result
        })
        console.log('test =====', result.length == 0)
        // result => [] OR ['roomid'] // []일 경우, 사용자 둘이 같이 있는 방이 없어서 새로 생성해야함.
        if (result.length == 0) {
            const roomid = privateRoomName
            const me = await User.findOne({ where: { userid: myID } })
            const other = await User.findOne({ where: { userid: otherID } })
            const room = await Room.create({
                roomid: privateRoomName
            })
            const usersAddedToRoom = await room.addUsers([me, other])
            //소캣조인 후 에밋

            res.send(roomid)
        } else {
            const [roomid] = result
            //소캣조인 에밋

            res.send(roomid)
        }
    } catch (error) {
        console.log(error)
    }
})

router.delete('/testDeleteChat', async (req, res) => {
    try {
        const { myID, otherID, roomID } = req.body
        const me = await User.findOne({ where: { userid: myID } })
        const other = await User.findOne({ where: { userid: otherID } })
        const room = await Room.findOne({ where: { roomid: roomID } })
        const remove = await me.removeRoom(room)
        const usersLeftInChat = await UserRoom.findAll({
            where: {
                [Op.and]: [
                    { roomid: roomID },
                    { userid: { [Op.ne]: myID } }
                ]
            },
            attributes: ['roomid', 'userid']
        })

        if (usersLeftInChat.length == 0) {
            const destroyChat = await Room.destroy({
                where: {
                    roomid: roomID
                }
            })
            res.send({ msg: 'myID deleted from UserRoom && room destroyed' })
        } else {
            res.send({ msg: 'myID deleted from UserRoom' })
        }
    } catch (error) {
        console.log(error)
        res.send({ result: false })
    }
})

router.post('/bla', async (req, res) => {
    try {
        const {roomID, senderID, content} = req.body
        const newMessage = await Chat.create({
            roomid: roomID,
            senderid: senderID,
            content: content
        })
        res.json({result: true, data: newMessage})
    } catch (error) {
        console.log(error)
        res.json({result: false})
    }
})



module.exports = router