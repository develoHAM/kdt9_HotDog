const { DataTypes } = require('sequelize');

const CommentModel = (sequelize) => {
    return sequelize.define('Comment', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        writer: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    }, {
    });
};

module.exports = CommentModel;
