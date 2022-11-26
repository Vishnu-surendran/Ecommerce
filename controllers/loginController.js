
const{connectToDb,getDb}=require("../config/dbconnection")
const config=require('../otp/config')
const session = require("express-session")
const { ObjectId } = require("mongodb");
const bcrypt=require('bcrypt')
const client=require("twilio")(config.accountSID,config.authToken,config.serviceID)
const Razorpay=require('razorpay');
const { resolve } = require("path");
const { rejects } = require("assert");
var ObjectID = require("mongodb").ObjectId
var instance = new Razorpay({
  key_id: 'rzp_test_ghI1dru1Zb1XVo',
  key_secret: '9mLYtLTfO2Ah6CPqKYyPBls9',
});

let db;

connectToDb(()=>{
    db=getDb()
})
const mobilelogin=(req,res)=>{
  const mobilenumber=req.body.lognumber
  db.collection('users')
  .findOne({mnumber:mobilenumber})
  .then((result)=>{
   let dbmnumber=result.mnumber
   console.log(dbmnumber);
    client
    .verify
    .services(config.serviceID)
    .verifications
    .create({
        to:'+91'+dbmnumber,
        channel:'sms'
    })
        console.log("otp");
        res.render("loginotp",{dbmnumber})
}).catch((err)=>{
  res.render("login",{message:"Mobile number does not exist"})
})
}
const checkingforLogin=(req,res)=>{
    if( req.session.userloggedIn){
      let status=req.session.userloggedIn
      console.log(status);
   
   
   
    res.render("home",{status:status})
   
    }else{
      let status=req.session.userloggedIn
     
     
          res.render("home",{status:status})
        
       
       
    }
      

  }
const loginVerify=(req,res)=>{
  const{num1,num2,num3,num4,num5,num6}=req.body
  let code=[num1,num2,num3,num4,num5,num6].join("")
  const dbmnumber=req.query.id
  console.log(dbmnumber)
  client
  .verify
  .services(config.serviceID)
  .verificationChecks
  .create({
      to:'+91'+dbmnumber,
      code:code
}).then(()=>{
  console.log("completed otp");
 req.session.userloggedIn=true
 if(req.session.userloggedIn){
  let status=req.session.userloggedIn
      console.log(status);

    res.render("home",{status:status})
  

       
 
}else{
  res.redirect("/login")
}
})
}


const loginPage=(req,res)=>{
    if( req.session.userloggedIn){

      let status=req.session.userloggedIn
  
      console.log(status);
   
    res.render("home",{status:status})

       
    }else{
    console.log("started")
    res.render("login")
    }
 
}

const logout=(req,res)=>{
  req.session.userloggedIn=false
  if( !req.session.userloggedIn){
    res.redirect('/login')
   
}else{
 let status=req.session.userloggedIn
   
      console.log(status);
    
    console.log(restaurants[0].categories[0]);

    res.render("home",{status:status})
 
      
}

    console.log('session deleted','loggedout');
    
    res.render('login')
}


const loginValidation= (req,res)=>{
    let {logemail,logpassword}=req.body
   
    console.log('validating login');
    console.log(req.body);
        db.collection('users')
        .findOne({email:logemail})
        .then((ress) => {
           let data = ress
           
        let passchech=data.password
        if (logpassword ==passchech) {
          console.log("passcheck");
          if(data.status=="blocked"){
            res.render('login',{Message:'You are blocked'})
          }else{
            req.session.userloggedIn=true
            req.session.user=data
            let status=req.session.userloggedIn
        
            console.log(status);
            res.render("home",{status:status})
      
        }
      }else{res.render('login',{Message:'Please check your password'})}    
        })
        .catch((rej) =>{
            console.log("user doesn't exist")
            res.render('login',{title:"user doesn't exists"})
        })
    
}



const addtocart=(req,res)=>{

  if(req.session.userloggedIn){
    const [proname,proId]=req.query.id
const userId=req.session.user._id
console.log(proId);
console.log(proname);
/* const qcount=req.body.count; */

db.collection("restaurants").findOne({'vegproducts.name':proname})
.then((resolve)=>{
  console.log(resolve);
  let pprice
  let restaurantname=resolve.restaurantname
  let address=resolve.Address
  console.log(resolve.vegproducts[0].price, 'thhhh');
for(var i=0;i<resolve.vegproducts.length;i++){
  if(resolve.vegproducts[i].name==proname){
    pprice=resolve.vegproducts[i].price
  }
}
let proObj={
  item:proname,
  price:pprice,
  quantity:1
}
db.collection("cart").findOne({user : ObjectId(userId)})
.then((resolve)=>{
console.log(resolve);
if(resolve){
  let proExist=resolve.products.findIndex(product=> product.item==proname)
  console.log(proExist);
  if(proExist!=-1){
    db.collection("cart").updateOne({"products.item":proname},
    {
      $inc:{"products.$.quantity":1}
    }).then((resolve)=>{
     
console.log("quantity added")
    }).catch(()=>{
      console.log("cannot add products to cart");
    })
  }else{
db.collection("cart").updateOne({user:ObjectId(userId)},{$push:{products:proObj}})
.then((response)=>{
  console.log('updated omn');
}).catch(()=>{
console.log("cannot add products");
})
  }
}else{
  let cartobj={
    user:ObjectId(userId),
    resturant:restaurantname,
    address:address,
    products:[proObj]
  }
  db.collection("cart").insertOne(cartobj)
  .then((resolve)=>{
    console.log(resolve);
  })
}


})
db.collection("cart").findOne({user : ObjectId(userId)})
.then((resolve)=>{
let cartproducts=resolve
if(resolve){
let total = 0 
let grandTotal = 0
resolve.products.forEach((x) => {
  total = (x.price) * (x.quantity)
  grandTotal += total
})
let userId=req.session.user._id
let status=req.session.userloggedIn
console.log(proId);
db.collection("restaurants").findOne({_id : ObjectId(proId)})
.then((resolve)=>{
const{restaurantname,Address,categories,vegproducts}=resolve
let id=resolve._id
console.log('updated3');
res.render('restaurantdetail',{status,restaurantname,Address,categories,vegproducts,id,cartproducts,grandTotal})
})
}else{
  let userId=req.session.user._id
let status=req.session.userloggedIn
console.log(proId);
db.collection("restaurants").findOne({_id : ObjectId(proId)})
.then((resolve)=>{
const{restaurantname,Address,categories,vegproducts}=resolve
let id=resolve._id
res.render('restaurantdetail',{status,restaurantname,Address,categories,vegproducts,id,cartproducts})
})
}


})

})

}else{
  res.redirect('login')
}

}


const deleteCartproduct=(req,res)=>{
  if(req.session.userloggedIn){
    let status=req.session.userloggedIn
    const proId=req.query.id
    const resId=req.query.sid
const userId=req.session.user._id
let grandTotal
console.log('resid',resId);
console.log('proid',proId);
    db.collection("cart").updateOne({user : ObjectId(userId)},{$pull:{products:{item :proId}}})
    .then((resolve)=>{
  console.log('product deleted successfully');
    db.collection("restaurants").findOne({_id:ObjectId(resId)})
    .then((response)=>{
      console.log(response)
      db.collection("cart").findOne({user : ObjectId(userId)})
    .then((resolve)=>{
       cartproducts=resolve
       console.log(response)  
    const{restaurantname,Address,categories,vegproducts}=response
    let id=response._id
    console.log("idddd",id);
    if(resolve){
    resolve.products.forEach((x) => {
      total = (x.price) * (x.quantity)
      grandTotal += total
    })
    }
    console.log(vegproducts[0].pcategory);
      res.render('restaurantdetail',{status,restaurantname,Address,categories,vegproducts,id,cartproducts,grandTotal})
    })
    
    })
    })
  }else{
    res.redirect('/login')
  }

}
const addRestaurant=(req,res)=>{
console.log(req.body);

res.render("register-restaurant")
}

const user=(req,res)=>{
  if(req.session.userloggedIn){
   let userId=req.session.user._id
db.collection("users").findOne({_id : ObjectId(userId)})
.then((resolve)=>{
 let username=resolve.username
 let email=resolve.email
 let number=resolve.mnumber
  res.render("userprofile",{username,email,number})
})
   
  }else{
    res.redirect("/login")
  }
  
}
const updateProfile=(req,res)=>{
  if(req.session.userloggedIn){
    let userId=req.session.user._id
   let name=req.body.name
   let Email=req.body.email
   let mobile=req.body.mobile
   let address=req.body.address

 db.collection("users").updateOne({_id : ObjectId(userId)},{$set:{username:name,email:Email,mnumber:mobile,address:address}})
 .then((resolve)=>{
  console.log(resolve);
   res.redirect('/orders')
 })
     
   }else{
     res.redirect("/login")
   }
}


const changeQuantity=async(req,res)=>{
  if(req.session.userloggedIn){
let proId=req.body.proName
let count=parseInt(req.body.count)
let userId=req.session.user._id
let dbcount



  db.collection("cart").updateOne({user:ObjectId(userId),'products.item':proId},
  {
    $inc:{'products.$.quantity':count}
  }
  ).then((resolve)=>{
    db.collection("cart").findOne({user:ObjectId(userId)})
    .then((resolve)=>{
      let count
      for(i=0;i<resolve.products.length;i++){
        if(resolve.products[i].item==proId){
          dbcount=resolve.products[i].quantity
        }
      }
      console.log(dbcount);
      let total = 0 
let grandTotal = 0
resolve.products.forEach((x) => {
  total = (x.price) * (x.quantity)
  grandTotal += total
    })
    res.json({grandTotal,dbcount})
  })
})
}else{
  res.redirect('/login')
}}



const restaurants=(req,res)=>{

  let status=req.session.userloggedIn

  const restaurants=[]
  db.collection("restaurants")
  .find()
  .forEach(restaurantname => restaurants.push(restaurantname))
  .then(()=>{
    console.log(restaurants[0].categories[0]);
    res.render("restaurants",{restaurants,status})
  }).catch(()=>{
    console.log("error in products")
  })

}
const offers=(req,res)=>{
  let offers=[]
  let status=req.session.userloggedIn
  db.collection('coupons').find().forEach(name=>offers.push(name)).then(()=>{
    console.log(offers);
    res.render('offers',{status,offers})
  })
 
}
const userOrders=(req,res)=>{
  if(req.session.userloggedIn){
  let status=req.session.userloggedIn
  let userId=req.session.user._id
  db.collection("users").findOne({_id : ObjectId(userId)})
.then((resolve)=>{
 let username=resolve.username
 let email=resolve.email
 let number=resolve.mnumber
 let address=resolve.address
 const orderss=[]
 db.collection("orders")
 .find()
 .forEach(restaurant => orderss.push(restaurant))
 .then(()=>{
   console.log(orderss);
   console.log(orderss[0].resturant);
   console.log(orderss[0].status)
      res.render("userprofile",{orderss,username,email,number ,address,status})
 }).catch(()=>{
   console.log("error in products")
 })
  let orders=resolve
  console.log(resolve);



  
})
  } else{
    res.redirect('/login')
  }
}
const restaurantDetail=(req,res)=>{
  if(req.session.userloggedIn){
  let status=req.session.userloggedIn
  let proId=req.query.id
  let cartproducts
  let userId=req.session.user._id
  let total = 0 
let grandTotal = 0
console.log('restaurantid',proId);
  db.collection("restaurants").findOne({_id : ObjectId(proId)})
.then((response)=>{
  db.collection("cart").findOne({user : ObjectId(userId)})
.then((resolve)=>{
   cartproducts=resolve
   console.log(resolve)  
const{restaurantname,Address,categories,vegproducts}=response
let id=response._id
console.log("idddd",id);
if(resolve){
resolve.products.forEach((x) => {
  total = (x.price) * (x.quantity)
  grandTotal += total
})
}
console.log(vegproducts[0].pcategory);
  res.render('restaurantdetail',{status,restaurantname,Address,categories,vegproducts,id,cartproducts,grandTotal})
})

})
}else{
  res.redirect('/login')
}
  
}

const updateAddress=(req,res)=>{
  if(req.session.userloggedIn){
  let status=req.session.userloggedIn
  let area=req.body.area
  let address=req.body.address
  console.log(req.body);
  let userId=req.session.user._id
  db.collection('users').updateOne({_id:ObjectId(userId)},{$set:{address:address}})
  .then(()=>{
    res.render('userOrders',{message:"Address updated successfully",status})
  })
}else{
  res.redirect('/login')
}
}

const cod=(req,res)=>{
  if(req.session.userloggedIn){
  let userId=req.session.user._id
  
;
console.log(userId);
  db.collection('cart').findOne({user:ObjectId(userId)})
  .then((resolve)=>{
    console.log(resolve);
    let products=resolve.products
  let userObj={
     user:resolve.user,
     resturant:resolve.resturant,
      address:resolve.address,
date:new Date(),
status:'Placed',
payment:'cod',
products:products
  }
db.collection("orders").insertOne(userObj).then(()=>{
  db.collection('cart').deleteOne({user:ObjectId(userId)}).then(()=>{
    console.log("order resigistered")
    res.render('thanks')
  })
 
})
  })
}else{
  res.redirect('/login')
}
}
const checkout=(req,res)=>{
  let total = 0 
  let grandTotal = 0
  if(req.session.userloggedIn){
   let userId=req.session.user._id
   let address
  db.collection("cart").findOne({user:ObjectId(userId)})
  .then((resolve)=>{
    if(resolve){
resolve.products.forEach((x) => {
  total = (x.price) * (x.quantity)
  grandTotal += total
})
  }  db.collection('users').findOne({_id:ObjectId(userId)})
    .then((response)=>{
address=response.address
console.log('address',address);
let cartproducts=resolve
    res.render('checkout',{cartproducts,address,grandTotal})
    })


  })
 
  }
}

const payment=(req,res)=>{
  console.log(req.body.price)
  
  let price=req.body.price
  let userId=req.session.user._id
  var options={
    amount:price*100,
    currency:"INR",
    receipt:""+userId
  };
  instance.orders.create(options,function(err,order){
    console.log("neworder",order)
    res.json(order)
  })
}

const verifypayment=(req,res)=>{
  console.log("verify",req.body)
 let paymentDetails=req.body
  const crypto=require('crypto');
let hmac= crypto.createHmac('sha256','9mLYtLTfO2Ah6CPqKYyPBls9')
hmac.update(paymentDetails.payment.razorpay_order_id+'|' +paymentDetails.payment.razorpay_payment_id)
hmac=hmac.digest('hex')
if(hmac==paymentDetails.payment.razorpay_signature){
  console.log("payment success");
  res.json(hmac)
}else{
  rejects()
}
}
const orderPlace=(req,res)=>{
  if(req.session.userloggedIn){
  console.log(req.body);
let ndate=new Date()
  let userId=req.session.user._id
  db.collection('cart').findOne({user:ObjectId(userId)})
  .then((resolve)=>{
    console.log(resolve);
    let products=resolve.products
  let userObj={
    user:userId,
    name:req.body.name,
    address:req.body.address,
    state:req.body.state,
    city:req.body.city,
    pincode:req.body.zip,
    amount:req.body.total,
date:ndate,
month:ndate.getMonth(),
status:'Placed',
payment:'Online',
products:products
  }
db.collection("orders").insertOne(userObj).then(()=>{
  db.collection('cart').deleteOne({user:ObjectId(userId)}).then(()=>{
    console.log("order registered")
    res.json({message:'order successfull'})
  })
 
})
  })
}else{
  res.redirect('/login')
}
}

const cancelOrder=(req,res)=>{
  if(req.session.userloggedIn){
  let orderId=req.query.id
let status='cancelled'
db.collection('orders').updateOne({_id:ObjectId(orderId)},{$set:{status:'canceled'}}).then((resolve)=>{
res.redirect("/orders")
})
}else{
  res.redirect('/login')
}
}

const reOrder=async(req,res)=>{
  if(req.session.userloggedIn){
  let orderId=req.query.id
  console.log(orderId);
  let userId=req.session.user._id
const orders= await db.collection('orders').aggregate([
  {
    $match:{
      _id:ObjectId(orderId)
  }

}
]).toArray()
let address
let orderlist={
  user:ObjectId(userId),
  resturant:orders[0].resturant,
  address:orders[0].address,
  products:orders[0].products,
  status:'placed'
}
  db.collection('cart').insertOne(orderlist).then(()=>{
   
  res.redirect('/checkout')
  })
}else{
  res.redirect('/login')
}
}

const offerApply=(req,res)=>{
  if(req.session.userloggedIn){
  let userId=req.session.user._id
  let Code=req.body.code
 let price=req.body.price
 if(ObjectID.isValid(Code)==true){
db.collection('users').findOne({_id:ObjectId(userId)}).then((resolve)=>{
  let coupons=resolve.coupons
  db.collection('coupons').findOne( { _id:ObjectId(Code)} )
  .then((response)=>{
let discount=response.discount
let total=price-discount
let cartCoupons={
  coupons:[{couponId:ObjectId(Code),
    name:response.name,
    price:response.discount}]
}
let userNewCoupons={
  user:ObjectId(userId),
    couponId:ObjectId(Code),
    name:response.name,
    price:response.discount
}
let existCoupon={
    couponId:response._id,
    name:response.name,
    price:response.discount
}
  db.collection('usercoupon').findOne({user:ObjectId(userId)}).then((resolve)=>{
    if(resolve){
      console.log("users",resolve);
      db.collection('usercoupon').findOne({user: ObjectId(userId),couponId:ObjectId(Code)}).then((response)=>{
        console.log('entered here');
        console.log(response);
if(response){
  console.log('existing coupon')
  res.json({Message:"You Have already used the coupon !"})
}else{

db.collection('usercoupon').insertOne(userNewCoupons).then((response)=>{

  console.log('coupon inserted successfully1');
  res.json({total,discount})
        })
      }
/* else{
  db.collection('users').updateOne({_id:ObjectId(userId)},{$push:{coupons:existCoupon}}).then(()=>{
    console.log('coupon updated successfully');
    res.json({total,discount})
  })
} */
   })
    }else{
      db.collection('usercoupon').insertOne(userNewCoupons).then((response)=>{
     
console.log('coupon inserted successfully');
res.json({total,discount})
      })
    }
  })
 


  })
/* }else{
  res.json({Message:""})
} */


})
 
}else{

}
}else{
  res.redirect('/login')
}
}

const successPage=(req,res)=>{
  res.render('thanks')
}
const search=async(req,res)=>{
  console.log('searching');
  let search=req.body.search
  console.log(search);
  return new Promise(async (resolve, reject) => {
 
    try {
    console.log('entered6');
        await db.collection('restaurants').createIndex({ restaurantname: "text" }).then((response) => {
          console.log('entered4');
            new Promise(async (resolve, reject) => {
               let products = await db.collection('restaurants').find({ $text: { $search: search } }, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } }).toArray()
              console.log('entered1');
               console.log(products)
                resolve(products)
            }).then((products) => {
                if (products == "") {
                  console.log('entered2');
                    console.log("products are null")
                }else{
                  console.log('entered3');
                  console.log(products)
                  res.render("restaurantsearch", { products});
                  resolve(products)
                }
            })
        })
    } catch {
      console.log("Error occured")
        res.status(400).send({ sucess: false })
        
    }
})
}
module.exports = {
    loginPage,
    loginValidation,
    logout,
    checkingforLogin,
    mobilelogin,
    loginVerify,
    addtocart,
    deleteCartproduct,
    addRestaurant,user,
    updateProfile,
    changeQuantity,
    restaurants,
    offers,userOrders,
    restaurantDetail,
    checkout,
    updateAddress,
    cod,
    payment,
    verifypayment,
    orderPlace,
    cancelOrder,
    reOrder,offerApply,
    successPage,
    search
}
