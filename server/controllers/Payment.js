const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const {mailSender} = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

//This old code was meant for purchasing only a single course at a timee

//Capture the payment and initiate the Razorpay order 
exports.capturePayment = async(req,res) => {
  
        //get courseId and user id
        // const {course_id} = req.body;

        const{courses} = req.body;
        
        const userId = req.user.id;
        
        //validation
        if(courses.length ===0){  //for all the courses in the cart
            return res.json({
                success : false,
                message : "Please provide Course id",
            })
        };
        

   //this was to check only a single course
        // if(!course_id){
        //     return res.status(404).json({
        //         success :false,
        //         message : "Please provde valid course Id",
        //     })
        // };



        //valid courseDetails

        let totalAmount = 0;

        for(const course_id of courses){
                   
            let course;
        try{
            course = await Course.findById(course_id);
            if(!course){
                return res.json({
                    success :false,
                    message : "Could not find the course",
                });
            }


        //check if user already enrolled in the course by checking STUDENTSENROLLED data in Course schema
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success :false,
                message :"Student is already enrolled",
            });
        }
        
           totalAmount += course.price;  //to add prices of all courses

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success :false,
            message : error.message,
        })
        
    }

        }
        

    //ORDER CREATE
    // const amount = course.price;
    // const currency = "INR";

    const options = {   //its your choice whether to pass them directly in order.create function or store them in a variable and pass it as a parameter
        amount  : totalAmount* 100,
        currency : "INR",
        receipt : Math.random(Date.now()).toString(),
        notes : {
            courseId : course_id,
            userId,
        }
    };

    try{
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        return res.status(200).json({
            success :true,
            message: paymentResponse,
            //Why was these all sent in Response 
            // courseName : course.courseName,                   
            //  courseDescription : course.courseDescription,
            //  thumbnail : course.thumbnail,
            //  orderId : paymentResponse.id,
            //  currency : paymentResponse.currency,
            //  amount : paymentResponse.amount,
        });
    }
    catch(error){
        console.log(error);
        res.json({
            success :false,
            message : "Could not initiate order",
        })
    }



};

//verify Signature of Razorpay and server 

exports.verifyPayment = async (req,res) =>{ 
    const webhookSecret = "12345678";

    const signature = req.headers["x-razorpay-signature"]; //NO NEED TO WORRY ABOUT THIS JUST REMEMBER THIS WAS DONE IN ORDER TO VERIFY SIGNATURE 
    //NOT NEEDED TO DO IN DEPTH 

    const shasum = crypto.createHmac("sha256", webhookSecret);//NO NEED TO WORRY ABOUT THIS JUST REMEMBER THIS WAS DONE IN ORDER TO VERIFY SIGNATURE 
    //NOT NEEDED TO DO IN DEPTH 
    shasum.update(JSON.stringify(req.body));//NO NEED TO WORRY ABOUT THIS JUST REMEMBER THIS WAS DONE IN ORDER TO VERIFY SIGNATURE 
    //NOT NEEDED TO DO IN DEPTH 
   
    const digest = shasum.digest("hex");
    
    if(signature === digest){
        console.log("Payment is authorised");

        const {courseId , userId} = req.body.payload.payment.entity.notes;  //DOUBT-- WILL BE CLEARED LATER ON 

        try{
            //fulfill the action

            //find the course and enroll the student in it 
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id : courseId},  //courseId se find kia and 
                { $push : {studentsEnrolled : userId}},    //students enrolled mai push kardia iss wali userId ko
                {new : true},  //this is supposed to be given in the UPDATE QUERY 
                
            );

            if(!enrolledCourse){
                return res.status(500).json({
                    success :false,
                    message : "Course not found",
                });

            }
            console.log(enrolledCourse);

            //SIMILARLY  ---> find the student and add the course to their enrolled courses 
            
            const enrolledStudent = await User.findOneAndUpdate(
                {_id : userId},
                {$push : { courses : courseId}},
                {new : true},
            );
            console.log(enrolledStudent);

            //SENDING CONFIRMATION MAIL 
            const  emailResponse = await mailSender(
                  enrolledStudent.email,
                  "Congratulations from  CodeHelp",
                  "Congratulations for onboarding Codehelp's new course",
            );

            console.log(emailResponse);
            return res.status(200).json({
                success :false,
                message : "Signature Verified and course Added",
            })


        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success :false,
                message : error.message,
            })

        }
    }

    else { 
        return res.status(400).json({
            success : false,
            message : "Invalid Request"
        });
    }


}

