const express = require("express")
const { authorizeRoles, checkuser } = require("../middleware/authmiddleware")
const { createProduct, getproducts, getsingleproduct, updateproduct, deleteProduct, createproductreview, getProductReviews, deleteReview } = require("../controllers/productcontroller")
const router = express.Router()
const upload = require("../middleware/upload");



router.post("/products" , checkuser , authorizeRoles("admin") , upload.single("image"), createProduct)
router.get("/products" , getproducts)
router.get("/products/:id" , getsingleproduct)
router.put("/products/:id" , checkuser , authorizeRoles("admin")  , upload.single("image"),updateproduct)
router.delete("/products/:id" , checkuser , authorizeRoles("admin") , deleteProduct)
router.post("/products/:id/reviews" , checkuser , createproductreview)
router.get("reviews" , getProductReviews)
router.delete("delete-review/:id" , checkuser , deleteReview)

module.exports = router