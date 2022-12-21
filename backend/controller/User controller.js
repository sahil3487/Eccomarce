const ErrorHandler = require("../utils/error handler");
const catchAsyncError = require("../Middleware/catch asyinc error");
const User = require("../models/User Model");
const sendToken = require("../utils/jwtToken");
const sendemail = require("../utils/sendEmail");
const crypto = require("crypto");
const { send } = require("process");
const { use } = require("../routes/User Routes");

//rigister user

exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "this is sample id ",
            url: "profilepicurl",
        },
    });
    sendToken(user, 200, res);
});

// login user

exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // chaecking if user has given password and email both

    if (!email || !password) {
        return next(new ErrorHandler("please Enter Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
});

// logout user

exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "logged out",
    });
});

// forgot password

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("user not found", 404));
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
    )}/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {
        await sendemail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});

// reset password

exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await user.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        return next(new ErrorHandler("reset password token is invalid or hass been expire", 400))
    }

    if (req.body.password != req.body.confirmPassword) {
        return next(new ErrorHandler("password does not Match", 400))
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire;

    await user.save()

    sendToken(user, 200, res)
});

// Get user details

exports.getUSerDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    })
})

//update user password
exports.updateUSerPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldpassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("old password is incorrect", 400))
    }
    if (req.body.newpassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not matched", 400))
    }

    user.password = req.body.newpassword;

    await user.save()

    sendToken(user, 200, res)
})


// update user profile

exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    // if (req.body.avatar !== "") {
    //     const user = await User.findById(req.user.id);

    //     const imageId = user.avatar.public_id;

    //     await cloudinary.v2.uploader.destroy(imageId);

    //     const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //         folder: "avatars",
    //         width: 150,
    //         crop: "scale",
    //     });

    //     newUserData.avatar = {
    //         public_id: myCloud.public_id,
    //         url: myCloud.secure_url,
    //     };
    // }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

// get all user (admin)

exports.getAllUser = catchAsyncError(async (req, res, next) => {

    const user =  await User.find()

    res.status(200).json({
        success:true,
        user
    });


})

// get single user (admin)

exports.getSingleUser = catchAsyncError(async (req, res, next) => {

    const user =  await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`user did not exist with Id:${req.params.id}`))
    }

    res.status(200).json({
        success:true,
        user
    });


});

// update user role

exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role:req.body.role
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

// delete user role (admin)

exports.deleteUserRole = catchAsyncError(async (req, res, next) => {
    

    const user = await User.findByIdAndUpdate(req.params.id)

    if(!user){
        return next (new ErrorHandler(`user does not exist with Id:${req.params.id}`))
    }
    await user.remove()

    res.status(200).json({
        success: true,
        message:"U ser Deleted Succesfully"
    });
});
