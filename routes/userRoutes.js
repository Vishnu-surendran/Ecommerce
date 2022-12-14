const express=require("express")
const router=express.Router()
const loginController=require("../controllers/loginController")
const signupController=require("../controllers/signupController") 


router.get("/",loginController.checkingforLogin)
router.get("/test",(req,res)=>{
    res.render('test')
})
router.get("/login",loginController.loginPage)
router.post("/home",loginController.loginValidation)
router.get("/addrestaurant",loginController.addRestaurant)
router.get("/userprofile",loginController.user)
router.get("/logout",loginController.logout)
router.get("/signup",signupController.signupPage)
router.get("/addtocart",loginController.addtocart)
router.get("/codorder",loginController.cod)
router.post('/order-success',loginController.orderPlace)
router.get('/order-success',loginController.successPage)
router.post('/search',loginController.search)
router.post("/payment",loginController.payment)
router.post("/verifypayment",loginController.verifypayment)
router.post("/quantity",loginController.changeQuantity)
router.post("/login",loginController.mobilelogin)
router.post("/signup",signupController.signupValidation)
router.post("/loginverify",loginController.loginVerify)
router.post("/verify",signupController.otpVerify)
router.post("/updateprofile",loginController.updateProfile)
router.post("/updateaddress",loginController.updateAddress)
router.get("/deleteproduct",loginController.deleteCartproduct)
router.get("/restaurants",loginController.restaurants)
router.get("/restaurant",loginController.restaurantDetail)
router.get("/offers",loginController.offers)
router.get("/orders",loginController.userOrders)
router.post("/applyoffer",loginController.offerApply)
router.get("/checkout",loginController.checkout)
router.post("/changequantity",loginController.changeQuantity)
router.get("/cancelOrder",loginController.cancelOrder)
router.get("/reOrder",loginController.reOrder)

module.exports=router

