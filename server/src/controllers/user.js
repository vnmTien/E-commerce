const userModel = require("../models/user.model");
const asyncHandler = require("express-async-handler");

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body;
    if (!email || !password || !firstname || !lastname)
        return res.status(400).json({
            sucess: false,
            message: "Missing inputs"
        });

    const emailUser = await userModel.findOne({email})
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
    const response = await userModel.findOne({email})
    // console.log(userModel.findOne({email}));
    // console.log(await response.isCorrectPassword(password)); 
    if (response && await response.isCorrectPassword(password)) {
        const { password, role, ...userData } = response.toObject(); 
        return res.status(200).json({
            sucess: true,
            userData // plain obj
        });
    } else {
        throw new Error("Invalid credentials");
    }
});

module.exports = {
    register,
    login
}