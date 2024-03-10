const AWS = require('aws-sdk');
require('dotenv').config();
const env = process.env;

const S3 = new AWS.S3({
	accessKeyId: env.accessKeyId,
	secretAccessKey: env.secretAccessKey,
	region: env.region,
});

const deleteDirectory = async (req, res, next) => {
	try {
		const data = await S3.listObjectsV2({
			Bucket: env.bucket,
			Prefix: `users/${req.user.userid}/`,
		}).promise();

		console.log('data', data);
		const objects = data.Contents.map(({ Key }) => ({
			Key,
		}));
		console.log('objects', objects);

		if (objects.length > 0) {
			await S3.deleteObjects({
				Bucket: env.bucket,
				Delete: { Objects: objects },
			}).promise();
		}

		await S3.deleteObject({
			Bucket: env.bucket,
			Key: `userid/${req.user.userid}/`,
		}).promise();

		return next();
	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
};

module.exports = { deleteDirectory };
