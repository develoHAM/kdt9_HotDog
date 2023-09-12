const express = require('express');
const controller = require('../controller/Cshare.js');
const router = express.Router();
const multer = require('multer');
const AWS = require("aws-sdk");
const multerS3 = require('multer-s3');

AWS.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: 'ap-northeast-2',
});
// const aws = require('aws-sdk'); // aws 설정을 위한 모듈

const s3 = new AWS.S3()

const upload = multer({
  storage: multerS3({
    s3: s3, // 접근 권한, // s3 인스턴스
    bucket: 'kdt9hotdog', // 버킷 name
    acl: 'public-read', // 파일 접근권한 (public-read로 해야 업로드 파일 공개)
    metadata: function (req, file, cb) {
      cb(null, { fieldname: file.fieldname });
    },

    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    }
  })
})

// 파일 업로드 설정 (multer 사용)
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//       cb(null, Date.now() + '-' + file.originalname);
//     },
//   });
//   const upload = multer({ storage });


router.get('/', controller.get_main)
router.get('/user', controller.get_User)
router.post('/shareCommit', upload.single('dynamic_file') , controller.post_shareCommit)
router.patch('/edit/:id', controller.patch_editShare)
router.delete('/delete', controller.delete_share)

module.exports = router;