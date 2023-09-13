'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

//모델
//db에 User생성
db.User = require('./User')(sequelize);
db.Room = require('./Room')(sequelize, Sequelize);
db.UserRoom = require('./User_Room')(sequelize, Sequelize);
db.Chat = require('./Chat')(sequelize, Sequelize);
db.Share = require('./Share')(sequelize);
db.Qna = require("./Qna")(sequelize);
db.Comment = require("./Comments")(sequelize);

db.User.hasMany(db.Qna, { foreignKey: 'writer', sourceKey: 'userid'});
db.Qna.belongsTo(db.User, { foreignKey: 'writer', targetKey: 'userid'});

db.Qna.hasMany(db.Comment, { foreignKey: 'qnaId'})
db.Comment.belongsTo(db.Qna, { foreignKey: 'qnaId'})

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User.belongsToMany(db.Room, {through: db.UserRoom, foreignKey: 'userid', otherKey: 'roomid', sourceKey: 'userid', targetKey: 'roomid'})
db.Room.belongsToMany(db.User, {through: db.UserRoom, foreignKey: "roomid", otherKey: 'userid', sourceKey: 'roomid', targetKey: 'userid'})

module.exports = db;
