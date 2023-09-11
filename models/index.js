'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

//모델
//db에 User생성
db.User = require('./User')(sequelize);
// db.Room = require('./Room')(sequelize);
db.UserRoom = require('./User_Room')(sequelize);
db.Share = require('./Share')(sequelize);
// db.RFID =require('./RFID')(sequelize);
// const model = require('./User');
// const temp = model(sequelize);
// db.User = temp;
// db.User.hasOne(db.User);
// db.RFID.belongsTo(db.RFID);
db.Qna = require("./Qna")(sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User.hasMany(db.Qna, { foreignKey: 'writer', sourceKey: 'userid' });
db.Qna.belongsTo(db.User, { foreignKey: 'writer', targetKey: 'userid' });
// db.qnaUser = qnaUser;
// db.qnaComment = qnaComment;

// qnaUser.initiate(sequelize);
// qnaComment.initiate(sequelize);

// qnaUser.associate(db);
// qnaComment.associate(db);

// db.User.belongsToMany(db.Room, {through: db.UserRoom, foreignKey: 'userid', otherKey: 'roomid', sourceKey: 'userid', targetKey: 'roomid'})
// db.Room.belongsToMany(db.User, {through: db.UserRoom, foreignKey: "roomid", otherKey: 'userid', sourceKey: 'roomid', targetKey: 'userid'})

module.exports = db;
