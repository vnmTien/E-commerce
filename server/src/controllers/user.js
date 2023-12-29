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
                message: "Creating User is not sucessfull!"
            });

        return res.status(200).json({
            sucess: newUser ? true : false,
            message: "User created successfully!",
            newUser
        })
    }
});

module.exports = {
    register,
}