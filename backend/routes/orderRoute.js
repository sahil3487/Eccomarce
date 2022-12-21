const express = require("express");
const {
    newOrder,
    getSingleOrder,
    myOrders,
    getAllOrders,
    updateOrder,
    deleteOrder,
} = require("../controller/orderController");
const router = express.Router();

const { isAuthencatedUser, authorizeRoles } = require("../Middleware/Auth");

router.post("/order/new", isAuthencatedUser, newOrder);

router
    .route("/orders/:id")
    .get(isAuthencatedUser, authorizeRoles("admin"), getSingleOrder);

router.route("/orders/me")
.get(isAuthencatedUser, myOrders);

router
    .route("/admin/order")
    .get(isAuthencatedUser, authorizeRoles("admin"), getAllOrders);
router
    .route("/admin/order/:id")
    .put(isAuthencatedUser, authorizeRoles("admin"), updateOrder)
    .delete(isAuthencatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
