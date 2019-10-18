var multer  = require('multer')
var upload = multer({ dest: 'uploads/image/inEditor' })
const sharp = require('sharp');
var uid = require('uid');
var fs = require('fs');
const axios = require('axios');

module.exports = {
    uploadInEditor: [
        upload.single('upload'),
        async (req, res) => {
            let fileName = uid(10);
            await sharp(req.file.path)
            .resize(320)
            .toFile('uploads/image/inEditor/resize/'+fileName, (err, info) => {
                // fs.unlinkSync(req.file.path);
                res.json({
                    uploaded: 1,
                    fileName: req.file.filename,
                    url: '/'+'uploads/image/inEditor/resize/'+fileName
                })
            });
        }
    ]
}