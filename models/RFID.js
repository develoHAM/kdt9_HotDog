const { DataTypes } = require('sequelize');

const RFID = (sequelize) => {
    return sequelize.define('user', {
        RFIDcode:{
            primaryKey:true,
            type:DataTypes.STRING(255),
            allowNull:false
        },
        dogregnumber:{
            type:DataTypes.STRING(40),
            allowNull:false,
        },
        ownername:{
            type:DataTypes.STRING(20),
            allowNull:false
        },
        ownerbirth:{
            type:DataTypes.STRING(30),
            allowNull:false
        }
    });
};

module.exports = RFID;
