const express = require("express");

const {
    registerUser,
    loginUser,
    logout,
    forgotPassword,
    resetPassword,
    getUSerDetails,
    updateUSerPassword,
    updateProfile,
    getAllUser,
    getSingleUser,
    updateUserRole,
    deleteUserRole,
} = require("../controller/User controller");
const { isAuthencatedUser, authorizeRoles } = require("../Middleware/Auth");
const { route } = require("./productRoutes");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.get("/logout", logout);
router.get("/me", isAuthencatedUser, getUSerDetails);
router.put("/password/update", isAuthencatedUser, updateUSerPassword);
router.put("/me/update", isAuthencatedUser, updateProfile);
router.get(
    "/admin/user",
    isAuthencatedUser,
    authorizeRoles("admin"),
    getAllUser
);
router.get(
    "/admin/user/:id",
    isAuthencatedUser,
    authorizeRoles("admin"),
    getSingleUser
);
router.put(
    "/admin/user/:id",
    isAuthencatedUser,
    authorizeRoles("admin"),
    updateUserRole
);
router.delete(
    "/admin/user/:id",
    isAuthencatedUser,
    authorizeRoles("admin"),
    deleteUserRole
);

module.exports = router;
