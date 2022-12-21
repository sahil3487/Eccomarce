const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");
const { stringify } = require("nodemon/lib/utils");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwtToken = require("jsonwebtoken");
const { reset } = require("nodemon");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more tha 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please enter your Email"],
        unique: true,
        validator: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "password should be grater than 8 characters"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String,
        default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

// jwt token we store in cookies
userSchema.methods.getJWTToken = function () {
    return jwtToken.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};
// Compare Password

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Genrating password reset token
userSchema.methods.getResetPasswordToken = function () {
    //genrating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hasing and adding resetpassword to user schema

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};

module.exports = mongoose.model("user", userSchema);
