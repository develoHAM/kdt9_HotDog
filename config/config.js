require('dotenv').config();
const env = process.env;

const development = {
	username: env.LOCAL_USERNAME,
	password: env.LOCAL_PASSWORD,
	database: env.LOCAL_DATABASE,
	host: env.LOCAL_HOST,
	dialect: env.LOCAL_DIALECT,
};

const production = {
	username: env.RDS_USERNAME,
	password: env.RDS_PASSWORD,
	database: env.RDS_DATABASE,
	host: env.RDS_HOST,
	dialect: env.RDS_DIALECT,
};

module.exports = { development, production };
