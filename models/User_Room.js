const { DataTypes } = require('sequelize');

const UserRoomModel = (sequelize) => {
    return sequelize.define('users_rooms', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
    })
}

module.exports = UserRoomModel;