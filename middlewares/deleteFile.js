const AWS = require('aws-sdk');
require('dotenv').config();
const env = process.env;

const S3 = new AWS.S3({
	accessKeyId: env.accessKeyId,
	secretAccessKey: env.secretAccessKey,
	region: env.region,
});

const deleteFile = async (req, res, next) => {
	try {
		console.log(req.user);
		const { profile } = req.user;

		if (profile == env.DEFAULT_PROFILE) {
			return next();
		}

		const objectKey = new URL(profile).pathname.substring(1);

		console.log('objectKey', objectKey);
		const params = {
			Bucket: env.bucket,
			Key: objectKey,
		};

		S3.deleteObject(params, (error, data) => {
			if (error) {
				console.log('error', error);
				return res.sendStatus(500);
			} else {
				console.log('data', data);
				return next();
			}
		});
	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
};

module.exports = { deleteFile };
