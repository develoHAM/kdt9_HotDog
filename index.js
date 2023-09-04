//라이브러리 불러오기
const http = require('http')
const express = require('express');
const SocketIO = require('socket.io')

const PORT = 8000;
const app = express();

const server = http.createServer(app)
const io = SocketIO(server)

//미들웨어
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//http 라우터
app.get('/', (req, res) => {
    res.render('main');
})

//산책 메이트 라우터
const mateRouter = require('./routes/mate.js')
app.use('/mate', mateRouter)

//소켓 라우터
const socketRouter = require('./routes/socket.js');
socketRouter(io)

//404 PAGE NOT FOUND
app.use('*', (req, res) => {
    res.render('404');
})

//서버 열기
server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})