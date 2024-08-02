const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async (req, res, next) => {
    try {
         //extract token    -> there are 3 ways of creating token
    const token =
    //   req.cookies.token 
    //   req.body.token ||
      req.header("Authorisation").replace("Bearer", "");
      console.log(token);

    
        // If token is missing, return an error response
        if (!token) {
          return res.status(401).json({
            success: false,
            message: "Token is missing",
          });
        }
    
        // Verify the token
        let decoded;
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
          console.log("Decoded token", decoded);
        } catch (err) {
          return res.status(401).json({
            success: false,
            message: "Token is invalid or expired",
          });
        }
    
        // Find the user based on the decoded token
        const user = await User.findById(decoded._id);
        if (!user) {
          return res.status(401).json({
            success: false,
            message: "User not found",
          });
        }
    
        // Attach the user to the request object
        req.user = user;
        next();
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "Something went wrong while validating the token",
        });
      }
    };
    

//isStudent
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected routes for student only",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User cannot be verified please try again",
    });
  }
};

//isInstructor

exports.isInstructor = async (req, res, next) => {
  try {
    console.log(req.user.role);
    if (req.user.role !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a protected routes for instructors only",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User cannot be verified please try again",
    });
  }
};

//isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected routes for Admins only",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User cannot be verified please try again",
    });
  }
};
