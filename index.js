//라이브러리 불러오기
const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');

const morgan = require("morgan"); 
const db=require('./models');
const cookieParser = require('cookie-parser');

const PORT = 8000;
const app = express();

const server = http.createServer(app)
const io = SocketIO(server)

//미들웨어
app.set('view engine', 'ejs');
app.set('views', './views')
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
//http 라우터
const indexRouter = require('./routes/main.js')
app.use('/', indexRouter);

//산책 메이트 라우터
const mateRouter = require('./routes/mate.js')
app.use('/mate', mateRouter)

//소켓 라우터
const socketRouter = require('./routes/socket.js');
socketRouter(io)

//게시판
const boardsRouter = require("./routes/boards.js");
app.use("/boards", boardsRouter);


//병원
const hospital = require("./routes/hospital.js");
app.use("/hospital",hospital)

//게시판
const shareRouter = require("./routes/share.js");
app.use("/share", shareRouter);


//404 PAGE NOT FOUND
app.use('*', (req, res) => {
    res.render('404');
})

//서버 열기

db.sequelize.sync({ force: false}).then(() => {
    server.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`)
    })
})