 const jwt = require("jsonwebtoken");
 require("dotenv").config();
 const User = require("../models/User");




//auth
exports.auth = async (req , res ,next)=>{
    try{
 
        //extract token    -> there are 3 ways of creating token 
        const token = req.cookies.token || req.body.token  || req.header("Authorisation").replace("Bearer", "");   

        //if token missing then return response 
        if(!token) {
            return res.status(400).json({
                success : false,
                message : "Token is missing",
            })
        }
        //verify the token 
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }

        catch(err){
            return res.status(401).json({
                success : false,
                message : "Token is invald",
            })

        }
        next();
    }
    
    catch(error){

        return res.status(401).json({
            success : false,
            message : "Something went wrong while validating the token",
        })
    }
}



//isStudent
exports.isStudent = async(req , res ,next) => {
    try{
        if(req.user.accountTye !== "Student") {
            return res.status(401).json({
                success : false,
                message : "This is a protected routes for student only",
            })
        }

  next();
    }
    catch(error){
        return res.status(500).json({
            success : false,
            message : "User cannot be verified please try again",
        })

    }
}


//isInstructor

exports.isInstructor = async(req , res ,next) => {
    try{
        if(req.user.accountTye !== "Instructor") {
            return res.status(401).json({
                success : false,
                message : "This is a protected routes for instructors only",
            })
        }

  next();
    }
    catch(error){
        return res.status(500).json({
            success : false,
            message : "User cannot be verified please try again",
        })

    }
}


//isAdmin
exports.isAdmin = async(req , res ,next) => {
    try{
        if(req.user.accountTye !== "Admin") {
            return res.status(401).json({
                success : false,
                message : "This is a protected routes for Admins only",
            })
        }

  next();
    }
    catch(error){
        return res.status(500).json({
            success : false,
            message : "User cannot be verified please try again",
        })

    }
}




