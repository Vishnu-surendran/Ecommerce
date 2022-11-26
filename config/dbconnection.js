const {MongoClient}=require('mongodb')


let dbConnection
module.exports={
   connectToDb:(cb)=>{
  MongoClient.connect('mongodb://0.0.0.0:27017/Mywebsite')
  .then((client)=>{
    dbConnection=client.db()
    console.log("Database Connected");
    return cb()
  })
  .catch(err=>{
    console.log(err)
    return cb(err)
  })
},
getDb:()=>dbConnection
}
