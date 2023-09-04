// 컨틀롤러 불러와야함

module.exports = function (io) {
    io.on('connection', (socket) => {
        controller.connection(io, socket);
    });
};