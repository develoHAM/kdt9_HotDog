const { DataTypes } = require('sequelize');
require('dotenv').config();
const env = process.env;

const UserModel = (sequelize) => {
	return sequelize.define('user', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false, //NOT NULL
			autoIncrement: true,
			primaryKey: true,
		},
		userid: {
			type: DataTypes.STRING(20),
			allowNull: false,
			unique: true,
		},
		pw: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING(10),
			allowNull: false,
		},
		birth: {
			type: DataTypes.STRING(30),
			allowNull: false,
		},
		phonenumber: {
			type: DataTypes.STRING(20),
			allowNull: false,
		},
		address: {
			type: DataTypes.STRING(20),
			allowNull: false,
		},
		dogname: {
			type: DataTypes.STRING(20),
			allowNull: false,
		},
		RFIDcode: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		profile: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: env.DEFAULT_PROFILE,
		},
	});
};

module.exports = UserModel;
