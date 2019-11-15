const {check, body, validationResult} = require('express-validator');
module.exports = [
    check('title').isLength({min: 1}).withMessage('trường bắt buộc').isLength({max: 150}).withMessage('Ký tự vượt quá 150 từ'),
    check('content').isLength({min: 1}).withMessage('trường bắt buộc'),
    body('startDate').custom((value, {req}) => {
        if (!req.body.setTime) {
            return true;
        }
        if (!value) {
            throw new Error('trường bắt buộc');
        }
        if (!(new Date(value))) {
            throw new Error('sai định dạng');
        }
        return true;
    }),
    body('endDate').custom((value, {req}) => {
        if (!req.body.setTime) {
            return true;
        }
        if (!value) {
            throw new Error('trường bắt buộc');
        }
        if (!(new Date(value))) {
            throw new Error('sai định dạng');
        }
        return true;
    }),
    body('errorSelectDate').custom((value, {req}) => {
        if (!req.body.setTime) {
            return true;
        }
        if ((new Date(req.body.startDate)) && (new Date(req.body.endDate)) && req.body.startDate >= req.body.endDate) {
            throw new Error('ngày sau phải lớn hơn ngày trước');
        }
        return true;
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors : errors.array() })
        }
        if (!req.user) {
            return res.status(403).send();
        }
        next();
    }
]