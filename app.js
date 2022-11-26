const express=require("express")
const app=express();
const {connectToDb,getDb}=require("./config/dbconnection")
const userRoutes=require("./routes/userRoutes")
const adminRoutes=require("./routes/adminRoutes")
const session = require('express-session');
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.set("view engine","ejs")
require("dotenv").config();
var pdf = require("pdf-creator-node");
var fs = require("fs");

let db
connectToDb((err)=>{
    if(!err){
        app.listen(3000,()=>{
            console.log("app listening on port 3000");
           
        })
        db=getDb()
    }
})
 app.get('/test',(req,res)=>{
    res.render('test')
 })

/* var html = fs.readFileSync("index.html", "utf8")
var options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "45mm",
        contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
    },
    footer: {
        height: "28mm",
        contents: {
            first: 'Cover page',
            2: 'Second page', // Any page number is working. 1-based index
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            last: 'Last Page'
        }
    }
}; */


/* var users = [
    {
      name: [{name:'anup'},{age:26}],
      age: "26",
    },
    {
      name:[{name:'anu'},{age:26}],
      age: "26",
    },
    {
      name: [{name:'an'},{age:26}],
      age: "26",
    },
  ]; */
 /*  var document = {
    html: html,
    data: {
      users: users,
    },
    path: "./output.pdf",
    type: "",
  };

pdf
  .create(document, options)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.error(error);
  });
 */
app.use(session({
    secret: "key",
    cookie:{"key":"secret",maxAge: 5 * 60 * 1000}

}));
app.use( function(req,res,next){
    res.set('cache-control','no-cache , no-store,must-revalidate,max-stale=0,post-check=0,pre-checked=0');
    
    next();
  });



app.use(userRoutes)
app.use(adminRoutes)


app.use((req ,res) =>{
    console.log('not found !!')
    res.status(404).render('404',{title:"404 | Page not found"});
})
