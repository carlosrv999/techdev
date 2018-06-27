var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');

var AccessKeyID = 'AKIAIRK73IOG2KYOSJUQ';
var SecretAccessKeyID = 'xckJNLSnlqdHjwfnb+MtF3QNqheO6lKcmPW6E5En';
var AWS = require('aws-sdk');
var s3 = new AWS.S3({
  accessKeyId: AccessKeyID,
  secretAccessKey: SecretAccessKeyID
});


let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './client/media');
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
  }
});

var upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) { //file filter
    if (['jpg', 'png', 'jpeg', 'JPG', 'PNG', 'JPEG'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
      return callback(new Error('Wrong extension type'));
    }
    callback(null, true);
  }
});

router.post('/upload-image', upload.array('photos'), (req, res, next) => {
  console.log(req.files);
  var filename = req.files[0]
  fs.readFile(req.files[0].path, (err, sourceData) => {
    if (err) {
      console.log('ERROR AL LEER ARCHIVO', err);      
      return res.status(500).json({
        err: err
      });
    }
    s3.putObject({
      Bucket: 'sige-parking',
      Key: req.files[0].filename,
      ACL: 'public-read',
      Body: sourceData
    }, (err, data) => {
      if (err) {
        console.log('ERROR AL UPLOADEAR', err);
        return res.status(500).json({
          err: err
        });
      }
      let urlImage = 'https://s3.amazonaws.com/sige-parking/' + req.files[0].filename;
      fs.unlink(req.files[0].path, (err) => {
        if (err) console.log('err: ', err);
      });
      return res.status(200).send({ exito: 'true', url_image: urlImage });
    })
  })
})

module.exports = router;