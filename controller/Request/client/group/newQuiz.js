const {check, body, validationResult} = require('express-validator');
module.exports = [
    check('title').isLength({min: 1}).withMessage('trường bắt buộc').isLength({max: 150}).withMessage('Ký tự vượt quá 150 từ'),
    check('content').isLength({min: 1}).withMessage('trường bắt buộc'),
    check('questions').isArray(),
    check('questions.*.content').not().isEmpty().withMessage('Chưa nhập câu hỏi'),
    body('startDate').custom((value, {req}) => {
        if (!req.body.setTime) {
            return true;
        }
        if (!value) {
            throw new Error('trường bắt buộc');
        }
        if (!Date.parse(value)) {
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
        if (!Date.parse(value)) {
            throw new Error('sai định dạng');
        }
        return true;
    }),
    body('errorSelectDate').custom((value, {req}) => {
        if (!req.body.setTime) {
            return true;
        }
        if (Date.parse(req.body.startDate) && Date.parse(req.body.endDate) && Date.parse(req.body.startDate) >= Date.parse(req.body.endDate)) {
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