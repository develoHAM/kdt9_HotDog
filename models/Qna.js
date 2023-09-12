const { DataTypes } = require('sequelize');

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
        });
    }




module.exports = QnaModel;

