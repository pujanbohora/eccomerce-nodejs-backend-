const { check, validationResult } = require('express-validator');

exports.validateSignupRequest = [
    [
        check('email').isEmail().withMessage('Valid Email is required'),
        check('password').isLength({ min: 6 }).withMessage('Password must be atleast 6 character long')
    ]
];

exports.validateSigninRequest = [
    [
        check('email').isEmail().withMessage('Valid Email is required'),
        check('password').isLength({ min: 6 }).withMessage('Password must be atleast 6 character long')
    ]
];

exports.isRequestValidate = function( req, res, next ) {
    const errors = validationResult(req);
    if (errors.array().length > 0){
        return res.json({ error : errors.array()[0].msg })
    }
    next()
}