const { DataTypes } = require('sequelize');

const CommentModel = (sequelize) => {
    return sequelize.define('shareComments', {
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        writer: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },postId: {
            type: DataTypes.INTEGER, 
            allowNull: false,
        },
    }, {
    });
};

module.exports = CommentModel;
