const express = require("express")
const { authorizeRoles, checkuser } = require("../middleware/authmiddleware")
const { createProduct, getproducts, getsingleproduct, updateproduct, deleteProduct, createproductreview, getProductReviews, deleteReview } = require("../controllers/productcontroller")
const router = express.Router()
const upload = require("../middleware/upload");



router.post("add-product" , checkuser , authorizeRoles("admin") , upload.single("image"), createProduct)
router.get("/get-allproducts" , getproducts)
router.get("get-product/:id" , getsingleproduct)
router.put("update-product/:id" , checkuser , authorizeRoles("admin") , updateproduct)
router.delete("delete-product/:id" , checkuser , authorizeRoles("admin") , deleteProduct)
router.put("add-product/:id" , checkuser , createproductreview)
router.get("reviews" , getProductReviews)
router.delete("delete-review/:id" , checkuser , deleteReview)

module.exports = router