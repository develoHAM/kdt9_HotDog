const { DataTypes } = require('sequelize');

const RoomModel = (sequelize) => {
    return sequelize.define('room', {
        roomid: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
        },
    })
}

module.exports = RoomModel;
