const express=require("express")
const app=express()
const{connectToDb,getDb}=require("../config/dbconnection")
app.use(express.urlencoded({extended:true}))
const { ObjectId } = require("mongodb");
const { Message } = require("twilio/lib/twiml/MessagingResponse");
const { RateLimitPage } = require("twilio/lib/rest/verify/v2/service/rateLimit");
let db;

connectToDb(()=>{
    db=getDb()
})
/* Admin loginPage */
const adminLoginpage=(req,res)=>{
  if(req.session.adminLoggedIn){
    return new Promise(async(resolve,reject)=>{
      let jan =await db.collection('orders').find({ month: 0 }).count()
      let feb =await db.collection('orders').find({ month: 1 }).count()
      let march =await db.collection('orders').find({ month: 2 }).count()
      let april =await db.collection('orders').find({ month: 3 }).count()
      let may =await db.collection('orders').find({ month: 4 }).count()
      let june =await db.collection('orders').find({ month: 5 }).count()
      let july =await db.collection('orders').find({ month: 6 }).count()
      let aug = await db.collection('orders').find({ month: 7 }).count()
      let sept =await db.collection('orders').find({ month: 8 }).count()
      let oct = await db.collection('orders').find({ month: 9 }).count()
      let nov =await db.collection('orders').find({ month: 10 }).count()
      let dec =await db.collection('orders').find({ month: 11}).count()
      console.log(oct,nov,dec);
      res.render("Admin/index",{jan,feb,march,april,may,june,july,aug,sept,oct,nov,dec});
    })
  }else{
    res.render("Admin/login")
}
}

/* Admin Validation */
const adminLogin=(req,res)=>{
    let{addemail,addpass}=req.body
   
    console.log(req.body);
    if(addemail==""||addpass==""){
      res.render('Admin/login',{Message:"Input field cannot be empty*"})
    } else if(addemail){
        password=addpass
        Email=addemail
  db.collection("Admin").findOne({Email:addemail})
  .then ((ress)=>{
    console.log(ress.Email);
    console.log(ress.password);
    console.log('checking exist');
    let data=ress
 
    let passcheck=data.password

    if(addpass==passcheck){
      req.session.adminLoggedIn=true
      return new Promise(async(resolve,reject)=>{
        let jan =await db.collection('orders').find({ month: 0 }).count()
        let feb =await db.collection('orders').find({ month: 1 }).count()
        let march =await db.collection('orders').find({ month: 2 }).count()
        let april =await db.collection('orders').find({ month: 3 }).count()
        let may =await db.collection('orders').find({ month: 4 }).count()
        let june =await db.collection('orders').find({ month: 5 }).count()
        let july =await db.collection('orders').find({ month: 6 }).count()
        let aug = await db.collection('orders').find({ month: 7 }).count()
        let sept =await db.collection('orders').find({ month: 8 }).count()
        let oct = await db.collection('orders').find({ month: 9 }).count()
        let nov =await db.collection('orders').find({ month: 10 }).count()
        let dec =await db.collection('orders').find({ month: 11}).count()
        console.log(oct,nov,dec);
        res.render("Admin/index",{jan,feb,march,april,may,june,july,aug,sept,oct,nov,dec});
      })
    }
    else{
      res.render('Admin/login',{Message:'Please Check Your Password',title:'password'})}
    
  })
  .catch((rej)=>{
    console.log("user doesn't exist")
    res.render('Admin/login',{Message:"user doesn't exists"})
  })
  }
  }
/* Admin addProduct */

const adProducts=(req,res)=>{
const restaurants=[]
  db.collection('restaurants')
  .find().forEach(restaurantname =>restaurants.push(restaurantname))
  .then(()=>{
    db.collection('categories').findOne({_id:ObjectId('6380fb433c74d716e09b1a24')}).then((resolve)=>{
      console.log("restaurant inserted successfully",restaurants[0].restaurantname)
      console.log(resolve);
      res.render("Admin/addproduct",{restaurants,resolve})
    })

  })
  
}


const addproducts=(req,res)=>{
  res.render('Admin/addproducts')
}

const addProduct=((req,res)=>{
  const{pname,pprice,pdescription,prestaurant}=req.body
  console.log(req.body);
  db.collection("products")
  .insertOne({name:pname,price:pprice,description:pdescription,restaurant:prestaurant})
  .then(()=>{
    res.render("Admin/addproduct",{Message:"Data Added successfully"})
  })
})

const addRestaurant=((req,res)=>{
  const{rname,raddress,rcategory,remail,rphone,et,pr,rimage}=req.body
  console.log(req.body);
  db.collection("restaurants")
  .insertOne({restaurantname:rname,Address:raddress,phone:rphone,email:remail,categories:rcategory,et,pr,img:rimage})
  .then(()=>{
    res.render("Admin/addrestaurant",{Message:"Data Added successfully"})
  })
})

  /* Admin Productlist Fetching */
  const productlist=((req,res)=>{
const products=[]
db.collection("products")
.find()
.forEach(name => products.push(name))
.then(()=>{
  res.render("Admin/Products",{products})
}).catch(()=>{
  console.log("unable to fetch");
})
  })

 const blockuser =((req,res)=>{
  const{id}=req.query
  console.log(id)
  db.collection("users").updateOne({_id:ObjectId(id)},{$set:{ status : "blocked" }}).then((resolve)=>{
      console.log("successfully blocked");
      console.log(resolve);
      res.redirect("/admin/users")
  }).catch(()=>{
      console.log("failed to block")
  })
 })
 const unBlockuser =((req,res)=>{
  const{id}=req.query
  console.log(id)
  db.collection("users").updateOne({_id:ObjectId(id)},{$set:{status:"unblocked"}}).then((resolve)=>{
      console.log("successfully unblocked");
      console.log(resolve);
      res.redirect("/admin/users")
  }).catch(()=>{
      console.log("failed to unblock")
  })
 })
 const deleteproduct =((req,res)=>{
  const{id}=req.query
  console.log(id)
  db.collection("products").updateOne({_id:ObjectId(id)},{$set:{statues:'deleted'}}).then(()=>{
      console.log("success");
      res.redirect("/admin/Products")
  }).catch(()=>{
      console.log("failed")
  })
 })

 const adminlogout=(req,res)=>{
  console.log('session deleted','loggedout');
  req.session.adminloggedIn=false;
  res.redirect('/adminlogin')
}

const restaurantlist=(req,res)=>{
  const restaurant=[]
  db.collection("restaurants").find()
  .forEach(restaurantname=>restaurant.push(restaurantname))
  .then(()=>{
    res.render("Admin/restaurants",{restaurant})
  })
}

const userlist=(req,res)=>{
  const users=[]
  db.collection("users")
  .find()
  .forEach(username =>users.push(username))
  .then(()=>{
      res.render("Admin/listings",{users})
      console.log(users[0].username);
  })
}


const banner=(req,res)=>{
  res.render("Admin/addbanner")
}
const adminBookings=(req,res)=>{
  res.render("Admin/bookings")
}

const coupons=(req,res)=>{
  const coupons=[]
db.collection('coupons').find().forEach(name=>coupons.push(name))
.then(()=>{

  res.render("Admin/coupons",{coupons})
})
}
const addCoupons=(req,res)=>{
  res.render("Admin/addcoupons")
}

const addcoupons=(req,res)=>{
  
  db.collection('coupons').insertOne({}).then(()=>{

    res.render("Admin/addcoupons",{Message:'Coupon added Successfully'})
  })
 
}

const bookings=async(req,res)=>{
  let userId=req.query.id
  console.log(userId);
let orders=await db.collection('orders').aggregate([
{
  $match:{user:ObjectId(userId)}
}

]).toArray()
 console.log(orders);
 res.render('Admin/bookings',{orders})
}


const cancelOrder=(req,res)=>{
let orderId=req.body.orderId
console.log(req.body);
db.collection('orders').updateOne({_id:ObjectId(orderId)},{$set:{isAdmincancelled:true}}).then((resolve)=>{
  console.log(resolve);
  console.log('admincancellled');
res.json({Message:"Cancelled by admin"})
})
}

const addBanner=(req,res)=>{
  console.log(req.body);
  db.collection('headers').insertOne({himage:req.body.rimage,hdescription:req.body.raddress,hname:req.body.rname}).then(()=>{
    console.log('successfully updated banner');
    res.render("Admin/addbanner",{Message:'successfully updated'})
  })
}

const addbBanner=(req,res)=>{
  console.log(req.body);

  db.collection('headers').updateOne({_id:ObjectId('6380693b3b2cb3766dad19d3')},{$set:{bimge:req.body.rimage,bdescription:req.body.raddress,bname:req.body.rname}}).then(()=>{
    console.log('successfully updated body banner');
  })
}

const addcategory=(req,res)=>{
  res.render('Admin/admincategory')
}

const adddcategory=(req,res)=>{
db.collection('categories').updateOne({_id:ObjectId('6380fb433c74d716e09b1a24')},{$push:{name:req.body.cname}}).then(()=>{
  console.log('successfully added');
  res.render('Admin/admincategory',{Message:'successfully added'})
})
}
  module.exports={
    adminLogin,
    adminLoginpage,
    productlist,
    addProduct,
    blockuser,unBlockuser,adminlogout,
    restaurantlist,userlist,deleteproduct,adminBookings,
    addRestaurant,
    adProducts,
    banner,
    coupons,addCoupons,bookings,cancelOrder,
    addproducts,
addBanner,
addbBanner,
addcategory,
adddcategory
  }