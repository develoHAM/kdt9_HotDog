const { DataTypes } = require('sequelize');

const RoomModel = (sequelize) => {
    return sequelize.define('room', {
        roomID: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
        },
        creatorID: {
            type: DataTypes.STRING(20),
            allowNull: false,
        }
    })
}

module.exports = RoomModel;
