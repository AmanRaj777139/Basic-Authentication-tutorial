const mongoose = require('mongoose');

const connect =  mongoose.connect("mongodb://localhost:27017/basicauth");

//check connection build
connect.then(()=>{
    console.log("Mongodb connected succesfully");
}).catch(()=>{
    console.log("Database not connected");
});

//Create a schema
const LoginSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    password:{
        type: String,
        require:true
    }
});

//Collection part
const collection = new mongoose.model("user",LoginSchema);
module.exports = collection;