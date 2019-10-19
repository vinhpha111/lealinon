var multer  = require('multer')
var upload = multer({ dest: 'uploads/image/inEditor' })
const sharp = require('sharp');
var uid = require('uid');
var fs = require('fs');
const axios = require('axios');
var FormData = require('form-data');

module.exports = {
    uploadInEditor: [
        upload.single('upload'),
        async (req, res) => {
            var dir = './uploads/image/inEditor/resize';
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }

            let fileName = uid(10);
            await sharp(req.file.path)
            .resize(320)
            .toFile('uploads/image/inEditor/resize/'+fileName, (err, info) => {
                // fs.unlinkSync(req.file.path);
                res.json({
                    uploaded: 1,
                    fileName: req.file.filename,
                    url: base_url('uploads/image/inEditor/resize/'+fileName)
                })
            });
            
        }
    ]
}

function uploadToImgBB(imageFile){
    let key = 'f6bde4da72fa13b0fc0d83a6c3734cd6';
    let image = base64_encode(imageFile);
    axios.post('https://api.imgbb.com/1/upload?key='+key+'&image='+image)
    .then((res)=>{
        console.log(res);
        return res.data;
    })
    .catch((err)=>{
        console.log(err);
        throw err;
    })
}

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}