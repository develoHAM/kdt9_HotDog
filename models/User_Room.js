const { DataTypes } = require('sequelize');

const UserRoomModel = (sequelize) => {
    return sequelize.define('user_room', {
        userid: {
            type: DataTypes.STRING(20),
            allowNull: false,
            primaryKey: true,
        },
        roomID: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
        },
    })
}

module.exports = UserRoomModel;
