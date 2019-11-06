const {check, body, validationResult} = require('express-validator');
var xss = require("xss");
module.exports = [
    (req, res, next) => {
        if (req.body.content) {
            req.body.content = xss(req.body.content);
        }
        next();
    },
    check('content').isLength({min: 1}).withMessage('trường bắt buộc'),
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