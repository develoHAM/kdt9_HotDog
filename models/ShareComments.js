const { DataTypes } = require('sequelize');

const CommentModel = (sequelize) => {
    return sequelize.define('shareComments', {
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        writer: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        postId: {
            type: DataTypes.INTEGER, 
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
    }, {
    });
};

module.exports = CommentModel;
