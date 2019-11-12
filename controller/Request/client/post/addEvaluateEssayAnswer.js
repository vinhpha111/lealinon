const {check, body, validationResult} = require('express-validator');

module.exports = [
    (req, res, next) => {
        if (req.body.content) {
            req.body.comment = req.htmlFilter(req.body.comment);
        }
        next();
    },
    check('comment').isLength({max: 5000}).withMessage('Tối đa 5000 ký tự'),
    check('score').isIn([1,2,3,4,5,6,7,8,9,10]).withMessage('Chưa chọn điểm'),
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