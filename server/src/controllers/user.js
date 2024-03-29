const userModel = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { generateAccessToken, generateRefreshToken } = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body;
    if (!email || !password || !firstname || !lastname)
        return res.status(400).json({
            sucess: false,
            message: "Missing inputs"
        });

    const emailUser = await userModel.findOne({ email })
    if (emailUser)
        throw new Error("This Email has exsited!");
    else {
        const newUser = await userModel.create(req.body);

        if (!newUser)
            return res.status(400).json({
                sucess: false,
                message: "Register is not sucessfull!"
            });

        return res.status(200).json({
            sucess: true,
            message: "Register is successfull!",
            newUser
        })
    }
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({
            sucess: false,
            message: "Missing inputs!"
        });

    // mongodb trả về 1 intent obj
    const response = await userModel.findOne({ email })
    // console.log(userModel.findOne({email}));
    // console.log(await response.isCorrectPassword(password)); 
    if (response && await response.isCorrectPassword(password)) {
        const { password, role, refreshToken, ...userData } = response.toObject();
        // create accessToken (xác thực người dùng, phân quyền người dùng)
        const accessToken = generateAccessToken(response._id, role);
        // create refreshToken (cấp mới accessToken)
        const newRefreshToken = generateRefreshToken(response._id);
        // save refreshToken of database
        await userModel.findByIdAndUpdate(response._id, { newRefreshToken }, { new: true });
        // save refreshToken in cookie
        res.cookie('New RefreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        return res.status(200).json({
            sucess: true,
            accessToken,
            userData // plain obj
        });
    } else {
        throw new Error("Invalid credentials");
    }
});

const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await userModel.findById(_id).select('-refreshToken -password -role');
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'User Not Found!'
        });
    }
    return res.status(200).json({
        success: true,
        user
    });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    // get token from cookies
    const cookie = req.cookies;
    // check existence of token 
    if (!cookie || !cookie.refreshToken) throw new Error('No Refresh Token in Cookies');
    // check sự hơp lệ (còn hạn dùng) hay ko
    const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
    const response = await userModel.findOne({ _id: result._id, refreshToken: cookie.refreshToken });
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : "Refresh Token not matched!"
    });
});

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie || !cookie.refreshToken) throw new Error('No Refresh Token in Cookies');
    // Delete refresh token in db
    const oldUser = await userModel.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshAccessToken: '' }, { new: true });
    // Delete refresh token in cookie
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    });
    return res.status(200).json({
        success: true,
        message: 'logout is done!'
    });
});

// Client gửi mail
// Server check email có hợp lệ hay không => Gửi mail + kèm theo link (password change token)
// Client check mail => Click link
// Client gửi api kèm token
// Check token có giống vs token mà server gửi mail hay ko
// Change password
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.query;
    if (!email) throw new Error("Missing email");
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("User not found");
    const resetToken = user.createPasswordChangedToken();
    await user.save();

    // create content for message
    const html = `Please click on the link below to change your password. This link will expire within 15 minutes! <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here<a/>`

    const result = await sendEmail(email, html);
    return res.status(200).json({
        success: true,
        result
    })
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body;
    if (!password || !token) throw new Error("Missing inputs");
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await userModel.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } }); // tgian trong Expires > tgian hiện tại => true
    if (!user) throw new Error("Invalid reset Token");
    // save new password, passResetToken, passChangeAt, passResetExpires (tgian hết hạn token gửi cho ngdung, khi họ quên mật khẩu)
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordChangedAt = Date.now();
    user.passwordResetExpires = undefined;
    await user.save();
    return res.status(200).json({
        success: user ? true : false,
        message: user ? "Updated password" : "Something went wrong"
    });
});

const getAll = asyncHandler(async (req, res) => {
    const users = await userModel.find().select('-refreshToken -password');
    return res.status(200).json({
        success: users? true : false,
        Users: users
    });
});

const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.query;
    if(!_id) throw new Error("Missing inputs");
    const dUser = await userModel.findByIdAndDelete(_id);
    return res.status(200).json({
        success: dUser ? true : false,
        deleteUser: dUser ? `User and Mail ${dUser.email} deleted` : "No User Delete" 
    });
});

module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getAll,
    deleteUser
}