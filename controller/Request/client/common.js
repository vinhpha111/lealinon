const {check, body, validationResult} = require('express-validator');
var ObjectId = require('mongodb').ObjectID;
module.exports = [
    check('id').custom((val, {req}) => {
        if (req.params.id && !ObjectId.isValid(req.params.id)) {
            throw new Error('format of id is not correct');
        }
        return true;
    }),
    check('groupId').custom((val, {req}) => {
        if (req.query.groupId && !ObjectId.isValid(req.query.groupId)) {
            throw new Error('format of groupId is not correct');
        }
        return true;
    }),
    check('exceptIds').custom((val, {req}) => {
        if (req.query.exceptIds && !Array.isArray(req.query.exceptIds)) {
            req.query.exceptIds = null;
        }
        return true;
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(404).json({ errors : errors.array() })
        }
        next();
    },
]