const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const verifyAccessToken = asyncHandler( async (req, res, next) => {
    if(req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if(err) return res.status(401).json({
                success: false,
                message: 'Invalid Access Token!'
            });

            console.log(decode);
            req.user = decode;
            next();
        })
    } else {
        return res.status(401).json({
            success: false,
            message: 'Require Authentication!'
        });        
    }
});

module.exports = {
    verifyAccessToken
}