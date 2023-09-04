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
        const socketIdsInRoom = io.sockets.adapter.rooms.get(data.roomName)
        console.log('getRooms =====', socketIdsInRoom)
        let users = [];
        socketIdsInRoom.forEach((socketID) => {
            const socketUser = io.sockets.sockets.get(socketID)
            users.push(socketUser.userid)
        })
        console.log('userids in room =========', users)
        io.to(data.roomName).emit('getUsers', users)
    })
}
