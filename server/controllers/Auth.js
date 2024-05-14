const User = require("../models/User");   //to check user exists
const otpGenerator = require("otp-generator");
const OTP = require("../models/OTP");    //to check unique otp 
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const jwt  = require("jsonwebtoken");
require("dotenv").config();


//Send otp  for email verification 

exports.sendotp = async (req,res) => {

    try{
    //fetch email 
    const {email} = req.body;     

    //check if regustered
    const checkUserPresent = await User.findOne({email});

    //if user already exist return a  response  
      
    if(checkUserPresent) {
        return res.status(401).json({
            success : false,
            message : "User already Registered",
        })
    }

    //Generate otp 
     var otp = otpGenerator.generate( 6, {
        upperCaseAlphabets : false,
        lowerCaseAlphabets : false,
        specialChars : false,
     });
     
     console.log( "Otp generated", otp);

     //check unique otp or not 

     const result = await OTP.findOne({otp :otp });

     //check karte rahenge until we dont get the unique otp 
     while(result) {
        otp = otpGenerator(6 , {
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars : false,
        });

        result = await OTP.findOne({otp : otp});
     }

     const otpPayload = {email , otp};
      //create entry for otp in Database

      const otpBody = await OTP.create(otpPayload);
      console.log(otpBody);

      return res.status(200).json({
        success : true,
        message : " OTP Sent successfully",
        otp,
      })



}

catch(error){
    console.log(error);

   return  res.status(500).json({
    success : false,
    message: error.message,

   })

}

};



// Signup-----------------------------------------------------------------------------------------------------

exports.signup = async (req,res) =>{

    try{
        // Destructure fields from the request body
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp,
      } = req.body
      // Check if All Details are there or not

      if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !confirmPassword ||
        !otp
      ) 
      {
        return res.status(403).send({
          success: false,
          message: "All Fields are required",
        })
      }

      if(password !== confirmPassword){
        return res.status(400).json({
            success : false,
            message : "Password and confirm password doesnt match",
        });
      }

      //check user already exist or not 


      const existingUser = await User.findOne({email});
      if(existingUser) {
        return res.status(400).json({
            success : false,
            message : "User already Registered",
        });
      }

      //find most recent otp stored for user 
      const recentOtp  = await OTP.find({ email }).sort({ createdAt :-1 }).limit(1) ;    //DOUBT -------
// ------------- sort OTP entries in descending order of their creation time 
      console.log(recentOtp);

      //validte OTP
      if(recentOtp.length ==0){
        return res.status(400).json({
            success : false,
            message : 'OTP Found',
        })
      }
      else if(otp !==  recentOtp[0].otp){
        return res.status(400).json({
            success : false,
            message : "Invalid OTP",
        })
      }

      //hash password 
      const hashedPassword = await bcrypt.hash(password,10);

      //entry create in DB

      const profileDetails = await Profile.create({
        gender : null,
        dateOfBirth : null,
        about : null,
        contactNumber : null,
      })

      const user = await User.create({
        firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails : profileDetails._id,
      image :` https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,  //api for making an image og first letter of first name and last name

      })

    //   return final res

    return res.status(200).json({
        success : true,
        message : " user is registered successfully",
        user,  
    })

    }

    
   

    catch(error){

        console.log(error);

        return res.status(500).json({
             success : false,
             message : "User not registered please try again",
        })
    }
}

//Login 

exports.login = async (req,res) =>{

    try{
        const {email,password} = req.body;
        //validation
        if(!email || !password){
            return res.status(403).json({
                success : false,
                message : "All fields are required ,please try again",
            });
        }

        //check user exists or not
        const user = await User.findOne({email})                 //  .populate(additionalDetails);  --no need
        if(!user){
            return res.status(401).json({
                success : false,
                message : "User is not registered, please Signup first",
            })
        }

        //Generate JWT , after password matching
         if( await bcrypt.compare(password,user.password) ){
            const payload = {
                email : user.email,
                id :user._id,  // id always comes in _ 
                role : user.accountType,
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn : "2h",

            });
            user.token = token ,
            user.password = undefined;

        

        //create cookie and send response 

        const options = {
            expires : new Date(Date.now() + 3*24*60*60*1000),
        }
       res.cookie("token" , token , options).status(200).json({
        success : true ,
        token ,
        user,   //why was user passed
        message :  " Logged in Successfully"
       })

    }

    else{
        return res.status(401).json({
            success : false,
            message : "Password in incorrect",
        })
    }

    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Login failure, please try again",
        });

    }

}

//ChangePassword 

exports.changePassword = async (req,res) =>{
    //get data from body
    try{

    const {email, oldPassword , newPassword} = req.body;


    //get oldPassword, newPassword, confirmPassword

    //validation 
    if(!email || !oldPassword || newPassword){
        return res.status(400).json({
            success : false,
            message : "Enter all the details please",
        });
    }

    const user = await User.find({email});

    if(!user){
        return res.status(404).json({
            success : false,
            message : "User not found",

        })
    }
  // compare old with the password stored in database 

    const isPasswordValid = await bcrypt.compare(oldPassword , user.password);

    if(!isPasswordValid){
        return res.status(401).json({
            success : false,
            message : "Doesnt match with old password",
        })
    }

    //hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //update user's password with new password

    user.password = hashedPassword;

     //update pwd in db
    await user.save();
    return res.status(200).json({
        success : false,
        message : "Password successfully updated",
    })


   


    //send mail -- password updated

    //return response
}
catch(error){
    console.log(error);

    return res.status(400).json({
        success : false,
        message : "Error in updating password",
    })


}
}

