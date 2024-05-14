const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        trim : true,
    },
    lastName :{
        type : String,
        required : true,
        trim : true,
    },

    password :{
        type : String,
        required : true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },

    accountType :{
        type : String,
        enum : ["Admin" , "Student" , "Instructor"],
        required : true,
    } ,

    additionalDetails : {   //Profile naam ke model ko reference kardia
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Profile",
    },

    courses :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Course",

    },

    image : [ {
        type : String,
        required : true,
    }
    ],
    
    token : {                // this was added in the Schema while creating ResetPassword controller               
        type : String,       // this was added in the Schema while creating ResetPassword controller    
    },             // this was added in the Schema while creating ResetPassword controller

    resetPasswordExpires : {// this was added in the Schema while creating ResetPassword controller
        type : Date,// this was added in the Schema while creating ResetPassword controller
    },// this was added in the Schema while creating ResetPassword controller

    courseProgress : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "CourseProgress",
        }
    ],

    


})

// module.exports = mongoose.model("User", userSchema); 
const User = mongoose.model('user', userSchema);

module.exports = User;