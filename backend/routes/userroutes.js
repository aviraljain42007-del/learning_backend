const express = require("express")
const router= express.Router()
const {login , logout ,register , getprofile , testuser , adminboard, addToCart, getMyCart, updateCartQuantity, removeFromCart} = require("../controllers/usercontroller")
const {checkuser , authorizeRoles} = require("../middleware/authmiddleware")
router.get("/test" , testuser)
router.get("/profile" , checkuser , getprofile)
router.get("/admin-dasboard" , checkuser , authorizeRoles("admin") , adminboard)
router.post("/logout", logout);
router.post("/register" , register)
router.post("/login" , login)
router.put("/add-cart" , addToCart)
router.get("/cart" , checkuser, getMyCart)
router.put("/cart-update" , checkuser , updateCartQuantity)
router.delete("/remove-from-cart" , checkuser , removeFromCart)



module.exports = router