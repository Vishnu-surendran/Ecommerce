const express=require("express")
const app=express()
const router=express.Router()
const adminController=require("../controllers/adminController")


router.get("/adminlogin",adminController.adminLoginpage)
router.post("/admin",adminController.adminLogin)
router.post("/admin/addproducts",adminController.addProduct)
router.get("/admin/restaurants",adminController.restaurantlist)
router.get("/admin/addcategory",adminController.addcategory)
router.post("/admin/addcategory",adminController.adddcategory)
router.post("/admin/addrestaurant",adminController.addRestaurant)
 router.get("/admin/addrestaurant",(req,res)=>{
    console.log("hiiiii");
        res.render("Admin/addrestaurant",{message:"Restaurant Added successfully"})
            })
router.get("/admindashboard",(req,res)=>{
    res.render("Admin/index")
})
router.get("/admin/bookings",adminController.adminBookings)
router.get("/admin/products",adminController.productlist)
router.get("/admin/header",adminController.banner)
router.post("/admin/add-header",adminController.addBanner)
router.post("/admin/add-header",adminController.addbBanner)
router.get("/admin/addproducts",adminController.adProducts)
router.get("/admin/coupons",adminController.coupons)
router.get("/admin/addcoupons",adminController.addCoupons)
/* router.get("/admin/add/restaurant",(req,res)=>{
    res.render("Admin/admin-add-author")
}) */


router.get("/admin/userBlock",adminController.blockuser)
router.get("/admin/userUnblock",adminController.unBlockuser)
router.get("/admin/logout",adminController.adminlogout)

router.get("/admin/users",adminController.userlist)

router.get("/admin/useredit",(req,res)=>{
    res.render("Admin/profile-edit")
})

router.post("/admin/cancelOrder",adminController.cancelOrder)
router.get("/adminlogin",adminController.adminLoginpage)
router.get("/admin/orders",adminController.bookings)
router.get("/admin/deleteproduct",adminController.deleteproduct)

module.exports=router
