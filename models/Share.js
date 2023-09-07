const { DataTypes } = require('sequelize');

const ShareModel = (sequelize) => {
    return sequelize.define('share', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false, //NOT NULL
            primaryKey: true,
            autoIncrement: true,
        },
        userid: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        title:{
            type:DataTypes.STRING(255),
            allowNull:false,
        },
        content:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
    });
};

module.exports = ShareModel;