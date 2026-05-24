const express = require("express")
const router= express.Router()
const {login , logout ,register, adminboard, addToCart, getMyCart, updateCartQuantity, removeFromCart, getuser} = require("../controllers/usercontroller")
const {checkuser , authorizeRoles} = require("../middleware/authmiddleware")
router.get("/admin-dasboard" , checkuser , authorizeRoles("admin") , adminboard)
router.post("/logout", logout);
router.post("/register" , register)
router.get("/user" ,checkuser , getuser)
router.post("/login" , login)
router.post("/cart" , checkuser , addToCart)
router.get("/cart" , checkuser, getMyCart)
router.put("/cart/:productId" , checkuser , updateCartQuantity)
router.delete("/cart/:productId" , checkuser , removeFromCart)



module.exports = router