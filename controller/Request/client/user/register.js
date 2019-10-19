const {check} = require('express-validator');
module.exports = [
    check('email').isEmail(),
    check('password')
        .isLength({ min: 8 }).withMessage('password chưa đúng'),
    check('password_confirm').custom((val, {req}) => {
        if (val !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
]