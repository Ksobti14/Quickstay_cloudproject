const mongoose=require('mongoose');
var MONGO_URL="mongodb+srv://kanavsobti:Kan200412@rooms.jr1wu.mongodb.net/Hotelbooking";
mongoose.connect(MONGO_URL,{useNewUrlParser:true});
var connection=mongoose.connection;
connection.on('error',()=>{
    console.log('mongo db connection failed');
})
connection.on('connected',()=>{
    console.log('Connected to db');
})
module.exports=mongoose;