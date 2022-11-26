
const express=require("express")
const app=express();





const middleware=(req,res,next)=>{
    res.set('cache-control','no-cache , no-store,must-revalidate,max-stale=0,post-check=0,pre-checked=0');
    next()
}




