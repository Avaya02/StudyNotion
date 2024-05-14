const mongoose = require("mongoose");
require("dotenv").config();

exports.dbConnect = () =>{

    mongoose.connect(process.env.MONGODB_URL)
    .then( () =>{
        console.log("DB connected Successfully")
    })

    .catch( (error) =>{
        console.log("DB connection issues");
        console.log(error);
        process.exit(1);
    })
}