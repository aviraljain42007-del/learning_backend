const express = require("express");
const { checkuser, authorizeRoles } = require("../middleware/authmiddleware");
const { createOrder, getMyOrders, getSingleOrder, getAllOrders, deleteOrder, updateOrderStatus } = require("../controllers/ordercontroller");
const router = express.Router();


router.post("/order", checkuser, createOrder);
router.get("/order" , checkuser , getMyOrders)
router.get("/order/:id" , checkuser , getSingleOrder)
router.get("/admin/orders" , checkuser , authorizeRoles("admin") , getAllOrders)
router.delete("/admin/order/:id" , checkuser , authorizeRoles("admin") , deleteOrder)
router.put("/admin/order/:id" , checkuser , authorizeRoles("admin") , updateOrderStatus)

module.exports = router;