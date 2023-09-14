const { DataTypes } = require('sequelize');

const ShareModel = (sequelize) => {
    return sequelize.define('share', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false, //NOT NULL
            primaryKey: true,
            autoIncrement: true,
        },
        title:{
            type:DataTypes.STRING(255),
            allowNull:false,
        },
        content:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        dynamic_file:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        writer:{
            type:DataTypes.STRING(20),
            allowNull:false
        },
    });
};

module.exports = ShareModel;