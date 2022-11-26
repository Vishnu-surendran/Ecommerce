const express=require("express")
const app=express()
const{connectToDb,getDb}=require("../config/dbconnection")
const config=require("../otp/config")
const bcrypt=require('bcrypt')
const client=require("twilio")(config.accountSID,config.authToken,config.serviceID)
let db;

connectToDb(()=>{
    db=getDb()
})

const signupPage=(req,res)=>{
    res.render("register")
}

const signupValidation=(req,res)=>{    
    let {email,username,password2,number}=req.body
    password2=bcrypt.hash(password2,10)
        db.collection("users")
        .findOne({email:email})
        .then((resolve)=>{
            console.log(resolve,"this is the resolve")
            if(resolve.email==email){
                res.render("register",{message:"This email already exist"})
            }
        })
        .catch((rej)=>{
            let dbusername=username
            let dbemail=email
            let dbpassword=password2
            let dbmnumber=number
            console.log(dbmnumber);
            db.collection("users")
            .insertOne({username:dbusername,email:dbemail,password:dbpassword,number:dbmnumber,status:"unblocked"})
            .then((result)=>{
                client
                .verify
                .services(config.serviceID)
                .verifications
                .create({
                    to:'+91'+dbmnumber,
                    channel:'sms'
                })
                    console.log("otp");
                    res.render("otp",{dbmnumber})
                
                   
            
            }).catch((err)=>{
                res.status(500).json({message:"couldnot create document"})
            })
        })
    }

    const otpVerify=(req,res)=>{
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
        res.redirect("/login")
    })
}

module.exports={
    signupPage,
    signupValidation,
    otpVerify
}