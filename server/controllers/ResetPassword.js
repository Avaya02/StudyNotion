
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcryptjs");
const {passwordUpdated} = require("../mail/templates/passwordUpdate");

exports.resetPasswordToken = async (req,res)  =>{
    try{
        //get email from body 
        const{email} = req.body;

        
        
    //email validation 
    const user = await User.findOne({email : email});

    if(!user){
        return res.status(401).json({
            success : false,
            message : "Your email is not registered",
        })
    }
     
    //generate token
    const token = crypto.randomUUID();    //This was npm crypto which was imported earlier but now its InBuilt 

    // update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate({
        email : email },
        {
            token : token ,
            resetPasswordExpires : Date.now() + 5*60*1000,  //Current date + 5 min
        },
        {new : true},
    )

    //create url 
    const url = `https://localhost:3000/update-password/${token}`

    //send mail containing the url 
    await mailSender(email , "Password Reset Link" ,
    `Your Link for email verification is ${url}. Please click this url to reset your password.`);

    //return response
    return res.json({
        success : true,
        message : "Passsword Successfully updated",
        
    })

    }

    catch(error){
        console.log(error);

        return res.status(500).json({
            success :false,
            message : "Error while resetting  password",
        })

    }
}


//Reset password

exports.resetPassword = async (req,res)  =>{
    try{
        const {password, confirmPassword , token} = req.body;
        if(confirmPassword !== password) {
            return res.json ({
                success : false,
                message : "Password and confirm password does not match",
            });
        }

            //get user details from db using token
            const userDetails = await User.findOne({token});

            if(!userDetails){
                return res.json({
                    success : false,
                    message : "Token is invalid",
                })

            }
            //token time check 
            if(userDetails.resetPasswordExpires > Date.now){
                return res.json({
                    success : false,
                    message : "Token is expired please regenrate your token",
                })
            }
            //hash password 
            const hashedPassword =  await bcrypt.hash(password, 10);  //await because it is an asynchrounous function and we cannot move further without
            //  this function returning Promise

            await User.findOneAndUpdate(
                {token : token},      //will search using token
                {password : hashedPassword},   //this will be updated
                {new : true},
            )
       return res.status(200).json({
        success : true,
        message : "Password reset successfull",
       })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message :"Error occured while resetting password",
        })

    }
}

