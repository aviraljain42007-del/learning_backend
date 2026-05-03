const express = require("express");
const { checkuser } = require("../middleware/authmiddleware");
const { createOrder, getMyOrders, getSingleOrder } = require("../controllers/ordercontroller");
const router = express.Router();


router.post("/order/new", checkuser, createOrder);
router.get("/my-order" , checkuser , getMyOrders)
router.get("/get-single-order/:id" , getSingleOrder)

module.exports = router;