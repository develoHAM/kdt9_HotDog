const { DataTypes } = require('sequelize');
const QnaModel = require("./Qna");
const UserModel = require("./User");

const CommentsModel = (sequelize) => {
    return sequelize.define('comment', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
             autoIncrement: true,
        },
        writerid: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        boardtype: {
            type: DataTypes.STRING(10),
            allowNull: false
        }
    });
}

module.exports = CommentsModel;

