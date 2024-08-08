const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async (req, res, next) => {
    try {
        //extract token    -> there are 3 ways of creating token
        const token =
          req.cookies.token ||
        //   req.body.token ||
        //   req.header("Authorisation").replace("Bearer", "");
          req.header("Authorisation")?.replace("Bearer ", "").trim();
    
        //if token missing then return response
        if (!token) {
          return res.status(401).json({
            success: false,
            message: "Token is missing",
          });
        }
        //verify the token
         
        // Akshat and Himanshu's shitty code  

        // console.log(token);
        // const decode = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded token", decode);
        // const user = await User.findById(decode?._id)
        // req.user = user;
        
        try {
          const decode = jwt.verify(token, process.env.JWT_SECRET);
          console.log(decode);
          req.user = decode;
        } catch (err) {
          return res.status(401).json({
            success: false,
            message: "Token is invald",
          });
        }
        next();
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: "Something went wrong while validating the token",
        });
      }
    };

//isStudent
exports.isStudent = async (req, res, next) => {
 try{
        if(req.user.accountType !== "Student") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Students only',
            });
        }
        next();
 }
 catch(error) {
    return res.status(500).json({
        success:false,
        message:'User role cannot be verified, please try again'
    })
 }
}


//isInstructor
exports.isInstructor = async (req, res, next) => {
    try{
           if(req.user.role !== "Instructor") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Instructor only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
   }


//isAdmin
exports.isAdmin = async (req, res, next) => {
    try{    
           console.log("Printing AccountType ", req.user.accountType);
           if(req.user.accountType !== "Admin") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Admin only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
   }