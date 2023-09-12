const { DataTypes } = require('sequelize');
const UserModel = require("./User");

const QnaModel = (sequelize) => {
    return sequelize.define('qna', {
            title: {
                type : DataTypes.STRING(127),
                allowNull: false,
            },
            contents: {
                type : DataTypes.TEXT,
                allowNull: false
            },
        }, {
            sequelize,
            timestamps: true,
            modelName: "qna",
            tableName: "qnas",
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }




module.exports = QnaModel;

