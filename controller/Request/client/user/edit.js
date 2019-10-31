const {check, body, validationResult} = require('express-validator');
const { Validator } = require('node-input-validator');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/image/avatar' })
var fs = require('fs');
var uid = require('uid');
const sharp = require('sharp');

module.exports = [
    (req, res, next) => {
        if (!req.user || req.user._id !== req.params.id) {
            return res.status(403).send();
        }
        next();
    },
    upload.single('avatarFile'),
    check('avatarFile').custom(async (val, {req}) => {
        if (req.file && ['image/jpeg', 'image/jpeg', 'image/png'].indexOf(req.file.mimetype) === -1) {
            throw new Error('dinh dang khong dung');
        }
        return true;
    }),
    check('name').exists().isLength({max: 30}).withMessage('Tối đa 30 ký tự'),
    check('introduce').exists().isLength({max: 1000}).withMessage('Tối đa 1000 ký tự'),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) {
                console.log(req.file);
                fs.unlinkSync(req.file.path);
            }
            return res.status(422).json({ errors : errors.array() })
        }
        var dir = './uploads/image/avatar/resize';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        
        let fileName = uid(10);
        if (req.file) {
            let resize = await sharp(req.file.path)
            .resize(120)
            .toFile('uploads/image/avatar/resize/'+fileName);
            if (resize) {
                fs.unlinkSync(req.file.path);
                req.avatarPath = '/uploads/image/avatar/resize/'+fileName;
            }
        }
        next();
    },
]