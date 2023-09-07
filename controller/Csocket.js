const { User, Room, UserRoom } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.connection = (io, socket) => {
    console.log('접속')

    socket.on('test', () => {
        console.log('test =====', io.sockets.adapter.rooms)
    })

    socket.on('joinRoom', (data) => {
        console.log('data =====', data)
        socket.join(data.roomName)
        socket.room = data.roomName
        socket.userid = data.userid

        const clientList = getUsersInRoom(socket.room)
        io.to(socket.room).emit('usersInRoom', clientList)
    })

    socket.on('leaveRoom', (userid, room) => {
        console.log(`${userid} left ROOM ${room}`)
        socket.leave(room)
        const clientList = getUsersInRoom(room)
        console.log('clientList =====', clientList)
        io.to(socket.room).emit('usersInRoom', clientList)
    })

    socket.on('disconnect', () => {
        if (socket.room) {
            console.log(`${socket.userid} left ROOM ${socket.room}`)
            socket.leave(socket.room)
            const clientList = getUsersInRoom(socket.room)
            io.to(socket.room).emit('usersInRoom', clientList)
        }
    })

    socket.on('createChat', async (data) => {
        const { myID, otherID, otherSocketID } = data
        const privateRoomName = uuidv4();
        console.log('privateRoomName ======', privateRoomName)
        socket.join(privateRoomName)
        io.in(otherSocketID).socketsJoin(privateRoomName)
        io.to(otherSocketID).emit('newChat', myID, otherID, privateRoomName)
        
        const addedRoom = await Room.create({
            roomid: privateRoomName
        })

        const addMyID = await UserRoom.create({
            userid: myID,
            roomid: addedRoom.roomid
        })

        const addOtherID = await UserRoom.create({
            userid: otherID,
            roomid: addedRoom.roomid
        })

    })

    function getUsersInRoom(room) {
        const socketIdsInRoom = io.sockets.adapter.rooms.get(room)
        let users = [];
        if (socketIdsInRoom) {
            socketIdsInRoom.forEach((socketID) => {
                const client = io.sockets.sockets.get(socketID)
                users.push({ userid: client.userid, socketid: client.id })
            })
        }
        return users;
    }
}
