const ErrorHandler = require("../utils/error handler");
const catchAsyncErrors = require("./catch asyinc error");
const jwt = require("jsonwebtoken");
const user = require("../models/User Model");

exports.isAuthencatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await user.findById(decodedData.id);

    next();
});

// authrization rolls

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resouce `,
                    403
                )
            );
        }

        next();
    };
};
