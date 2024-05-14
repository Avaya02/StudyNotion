const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
    email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
	},
});


async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,
			"Verification Email from StudyNotion", 
			emailTemplate(otp)); //FOR TEMPLATE     

        console.log("Email Sent Successfully", mailResponse);

    }

    catch(error){
        console.log("Error Occured while send Email",error);
        throw error;

    }
}

//Like in FileUpload project we use the PRE AND POST middleare to send email , here we also use the same WHERE the syntax is Schema.pre/post  

OTPSchema.pre("save", async function(next){   //D OUBT WHY WE USED NEXT  - > See documentation of Mongoose middlewares to find 
    await sendVerificationEmail(this.email , this.otp);  // current object ka email and otp
    next();

}
)



// module.exports = mongoose.model("OTP",OTPSchema); 
const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;

//--> Mail ka code Schema ke baad and model se pehle likhna is necessary