const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const crypto = require('crypto-js');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "member",
    },
    cart: {
        type: Array,
        default: [],
    },
    address: [{
        type: mongoose.Types.ObjectId,
        ref: "Adress",
    }],
    wishlist: [{
        type: mongoose.Types.ObjectId,
        ref: "Product",
    }],
    isBlocked: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
    },
    // Dùng cho quên mật khẩu
    passwordChangedAt: {
        type: String,
    },
    passwordResetToken: {
        type: String,
    },
    // tgian hết hạn token gửi cho ngdung, khi họ quên mật khẩu
    passwordResetExpires: {
        type: String,
    },
}, {
    timestamps: true,
});

//Hashcode password
userSchema.pre("save", async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods = {
    isCorrectPassword: async function (passwordLogin) {
        return await bcrypt.compare(passwordLogin, this.password); // Compare Password
    },
    // hàm tạo Token để thay đổi password
    createPasswordChangedToken: function () {
        const resetToken = crypto.randomBytes(32).toString('hex'); // tạo 1 đoạn token; hex: hệ thập lục phân
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex'); // lưu vào passwordResetToken
        this.passwordResetExpires = Date.now() + 15 * 60 * 1000; // lưu tgian tạo token + 15' để ktra mail
        return resetToken;
    } 
}

//Export the model
module.exports = mongoose.model('User', userSchema);