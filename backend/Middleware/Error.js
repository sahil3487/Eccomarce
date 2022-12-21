const ErrorHandler = require("../utils/error handler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message - err.message || "Internal server Error";

    // wrong mongodb Id error
    if (err.name === "casterror") {
        const message = `Resource not found.Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }
    // mongooese duplicate err

    if (err.code === 11000) {
        const message = `Duuplicate ${Object.keys(err.keyValue)} Entired`;
        err = new ErrorHandler(message, 400);
    }

    // Wrong web token
    if (err.name === "jsonWebTokenError") {
        const message = `JSON web token is Invalid,Try again`;
        err = new ErrorHandler(message, 400);
    }
    // JWT expire error

    if (err.name === "TokenExpiredError") {
        const message = `JSON web token is Expired,Try again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message, // we can include stack into it for finding perfect location of error
    });
};
