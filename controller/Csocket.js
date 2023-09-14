const { User, Room, UserRoom, Chat } = require('../models');
const { Op } = require('sequelize')
const { v4: uuidv4 } = require('uuid');

exports.connection = (io, socket) => {
    console.log('접속')

    socket.on('getChatList', async (myID) => {
        await getChatList(myID)
    })

    socket.on('joinRoom', (data) => {
        console.log('join Room (data) ====', data)
        socket.join(data.filter)
        socket.room = data.filter
        socket.userid = data.userid

        const clientList = getClientList(socket.room)
        console.log('join Room clientList ====', clientList)
        io.to(socket.room).emit('clientList', clientList)
    })

    socket.on('leaveRoom', (data) => {
        const {filter, myID} = data
        socket.leave(socket.room)
        const clientList = getClientList(filter)
        console.log('leaveRoom clientList ====', clientList)
        io.to(socket.room).emit('clientList', clientList)
    })

    socket.on('disconnect', () => {
        if (socket.room) {
            console.log(`${socket.userid} left ROOM ${socket.room}`)
            socket.leave(socket.room)
            const clientList = getClientList(socket.room)
            io.to(socket.room).emit('clientList', clientList)
        }
    })

    socket.on('startChat', async (data) => {
        startChat(data)
    })

    socket.on('leaveChat', async (data) => {
        leaveChat(data)
    })

    socket.on('fetchChatRoomData', async (data) => {
        fetchChatRoomData(data)
    })

    socket.on('message', async (data) => {
        const {myID, otherID, roomID, content} = data
        const senderID = myID
        const receiverID = otherID
        const newMessage = await Chat.create({
            roomid: roomID,
            senderid: senderID,
            content: content
        })
        const msgData = {
            senderID,
            receiverID,
            roomID,
            message: content
        }
        io.to(roomID).emit('newMessage', msgData)
    })


    // 함수들
    async function fetchChatRoomData(data) {
        const {myID, otherID, roomID} = data
        try {

            const messages = await Chat.findAll({
                where: {
                    roomid: roomID
                },
                order: [['createdAt', 'ASC']],
                attributes: ['id','senderid','content','createdAt']
            })
            const chatRoomInfo = {
                myID: myID,
                otherID: otherID,
                roomID: roomID,
                messages: messages
            }
            socket.emit('openChatRoom', chatRoomInfo)
        } catch (error) {
            console.log(error)
        }
    }

    // 같은 조건안에 존재하는 클라이언트들의 userid와 socketid가 담긴 객체들을 배열로 반환
    function getClientList(filter) {
        const socketIdsInRoom = io.sockets.adapter.rooms.get(filter)
        let users = [];
        if (socketIdsInRoom) {
            socketIdsInRoom.forEach((socketID) => {
                const client = io.sockets.sockets.get(socketID)
                users.push({ userid: client.userid, socketid: client.id })
            })
        }
        return users;
    }

    // userid를 받아서 해당 사용자가 속해있는 방들의 roomid와 해당 방에 속해있는 사용자들의 userid, 이름들을 반환
    async function getChatList(id) {
        try {
            const user = await User.findOne({
                where: {
                    userid: id
                },
                attributes: ['userid'],
                include: [
                    {
                        model: Room,
                        attributes: ['roomid'],
                        through: {
                            attributes: [],
                        },
                        include: [
                            {
                                model: User,
                                attributes: ['userid','name'],
                                through: {
                                    attributes: []
                                }
                            }
                        ]
                    }
                ]
            })
            const chatList = user.rooms.map((room) => {
                return {
                    roomid: room.roomid, 
                    users: room.users.map((user) => {
                        return user.userid
                    }), 
                    names: room.users.map((user) => {
                        return user.name
                    })
                }
            })
            // chatList = [ {roomid:'', users:['userid','userid'], names:['',''] }, ... ]

            const arrayOfRoomid = chatList.map((room) => {
                return room.roomid
            })

            arrayOfRoomid.forEach((roomid) => {
                socket.join(roomid)
            })

            socket.join(id)

            console.log('chatList =====', chatList)
            socket.emit('chatList', chatList)

        } catch (error) {
            console.log(error)
        }
    }

    //사용자가 본인 userid와 상대방의 userid, 그리고 상대방의 socketid를 보내고 이미 둘이 대화하고 있는 roomid가 있는지 확인한다. 있다면 해당 roomid를 반환, 없다면 새로운 uuid로 해당 roomid에 할당하여 새로운 room table row 생성, 그리고 두 userid 모두 생성된 방과 관계를 지어준다.
    async function startChat(data) {
        try {
            const { myID, otherID, otherSocketID } = data
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
            // result => [] OR ['roomid'] // []일 경우, 사용자 둘이 같이 있는 방이 없어서 새로 생성해야함.
            if (result.length == 0) {
                const privateRoomName = uuidv4();
                const roomid = privateRoomName
                const me = await User.findOne({ where: { userid: myID } })
                const other = await User.findOne({ where: { userid: otherID } })
                const room = await Room.create({
                    roomid: privateRoomName
                })
                const usersAddedToRoom = await room.addUsers([me, other])
                //새로 만들어진 roomid
                socket.join(roomid)
                io.in(otherSocketID).socketsJoin(roomid)
                // io.to(roomid).emit('openNewChatRoom', roomid)
                const roomInfo = {
                    roomID: roomid,
                    myID: myID,
                    otherID: otherID,
                }
                socket.emit('openNewChatRoom', roomInfo)
            } else {
                const [roomid] = result
                //이미 존재하는 roomid
                socket.join(roomid)
                io.in(otherSocketID).socketsJoin(roomid)
                // io.to(roomid).emit('openExistingChatRoom', roomid)
                const roomInfo = {
                    roomID: roomid,
                    myID: myID,
                    otherID: otherID
                }
                socket.emit('openExistingChatRoom', roomInfo)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function leaveChat(data) {
        try {
            const { myID, otherID, roomID } = data
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
                const destroyChatRoom = await Room.destroy({
                    where: {
                        roomid: roomID
                    }
                })
                const destroyChats = await Chat.destroy({
                    where: {
                        roomid: roomID
                    }
                })
                socket.emit('leftChat', 'myID deleted from UserRoom && room destroyed')
            } else {
                io.to(roomID).emit('leftChat', 'myID deleted from UserRoom')
            }
        } catch (error) {
            console.log(error)
            socket.emit('leftChat', `ERROR: ${error}`)
        }
    }
}
