const mongoose= require('mongoose');

mongoose.connect(process.env.mongo_url)

const connection= mongoose.connection;

//verrify connection

connection.on('connected',()=>{
    console.log('Mongodb sucessful');
})

//verrify connection error
connection.on('error',(err)=>{
    console.log('Mongo DB Connection Error',err);
})