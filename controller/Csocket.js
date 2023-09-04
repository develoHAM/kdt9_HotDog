exports.connection = (io, socket) => {
    console.log('접속')

    socket.on('createRoom', (data, cb) => {
        console.log('data =====', data)
        socket.join(data.roomName)
        socket.room = data.roomName
        socket.userid = data.userid
        cb()
    })

    socket.on('getRooms', (data) => {
        const users = getUsersInRoom(data.roomName)
        console.log('userids in room =========', users)
        io.to(data.roomName).emit('getUsers', users)
    })

    socket.on('disconnect', () => {
        if(socket.room) {
            console.log(`${socket.userid} left`)
            const users = getUsersInRoom(socket.room)
            io.to(socket.room).emit('getUsers', users)
            socket.leave(socket.room)
        }
    })

    function getUsersInRoom(room) {
        const socketIdsInRoom = io.sockets.adapter.rooms.get(room)
        let users = [];
        if (socketIdsInRoom) {
            socketIdsInRoom.forEach((socketID) => {
                const socketUser = io.sockets.sockets.get(socketID)
                users.push({userid: socketUser.userid, socketid: socketUser.id})
            })
        }
        return users;
    }
}
