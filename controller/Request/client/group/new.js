const {check} = require('express-validator');
module.exports = [
    check('name').isString().isLength({max: 150}).withMessage('max length 150'),
    check('description').isString().isLength({max: 1000}).withMessage('max length 1000'),
    check('status').isIn([1,2]),
]