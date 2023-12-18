const userModel = require("../models/user.model");
const asyncHandler = require("express-async-handler");

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body;
    if (!email || !password || !firstname || !lastname)
        return res.status(400).json({
            sucess: false,
            message: "Missing inputs"
        });
        
    const dataUser = await userModel.create(req.body);

    if (!dataUser) 
        return res.status(400).json({
            sucess: false,
            message: "Creating User is not sucessfull!"
        });

    return res.status(200).json({
        sucess: dataUser ? true : false,
        message: "User created successfully!",
        dataUser
    })

});

module.exports = {
    register,
}