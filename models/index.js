'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const qnaUser = require("./qnaUser");
const qnaComment = require("./qnaComment");

//모델
//db에 User생성
db.User = require('./User')(sequelize);
db.Room = require('./Room')(sequelize);
db.UserRoom = require('./User_Room')(sequelize);
db.Share = require('./Share')(sequelize);
// db.RFID =require('./RFID')(sequelize);
// const model = require('./User');
// const temp = model(sequelize);
// db.User = temp;
// db.User.hasOne(db.User);
// db.RFID.belongsTo(db.RFID);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.qnaUser = qnaUser;
db.qnaComment = qnaComment;

qnaUser.initiate(sequelize);
qnaComment.initiate(sequelize);

qnaUser.associate(db);
qnaComment.associate(db);

db.User.associate = function(models) {
    db.User.belongsToMany(models.Room, {
        through: 'User_Room',
        foreignKey: 'userid'
    })
}

db.Room.associate = function(models) {
    db.Room.belongsToMany(models.User, {
        through: 'User_Room',
        foreignKey: 'roomID'
    })
}



module.exports = db;
