const RatingAndReview = require("../models/RatingandReview")
const Course = require("../models/Course")
const mongoose = require("mongoose")

exports.createRating = async(req,res) =>{
    try{
        const userId = req.user.id;
        //fetch data from req.body;
        const {rating , review , courseId} = req.body;

        //check if user is enrolled or not
        const courseDetails = await Course.findOne(
            { _id : courseId,       //Course id se we find course then we check is user in studentsEnrolled or not 
            studentsEnrolled  : {$elemMatch : {$eq : userId} },    //can use alternate easy methods also  BTW $eq means equal to
     } ); 
     
     if (!courseDetails) {
        return res.status(404).json({
          success: false,
          message: "Student is not enrolled in this course",
        })
      }

      // Check if the user has already reviewed the course
    const alreadyReviewed = await RatingAndReview.findOne({
        user: userId,
        course: courseId,
      })
  
      if (alreadyReviewed) {
        return res.status(403).json({
          success: false,
          message: "Course already reviewed by user",
        })
      }

      //create rating and review

      const ratingReview = await RatingAndReview.create({
              user : userId,
              course : courseId,
            //   rating : user.rating,
            //   review : user.review,
            rating,
            review,
      });

      //update course with this rating and review 
    const updatedCourseDetails=   await Course.findByIdAndUpdate(
         courseId,
        { $push :{
            ratingAndReview : ratingReview._id,//becoz Course schema has ref of it
        }   },
        {new : true},
      );

      return res.status(201).json({
        success: true,
        message: "Rating and review created successfully",
        ratingReview,
      })

    }

    catch(error){
        console.error(error)
        return res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        })

    }
}

//GET AVERAGE RATING----------------------------------------------------------------------


exports.getAverageRating = async (req, res) => {
  try {
    const courseId = req.body.courseId

    // Calculate the average rating using the MongoDB aggregation pipeline

    const result = await RatingAndReview.aggregate([      //Checkout notes for Aggregation documentation and Syntax
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),  // Convert courseId to ObjectId
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ])

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      })
    }

    // If no ratings are found, return 0 as the default rating
    return res.status(200).json
    ({ success: true,
         averageRating: 0 });

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the rating for the course",
      error: error.message,
    })
  }
}



// Get all rating and reviews   
exports.getAllRating = async (req, res) => {
    try {
      const allReviews = await RatingAndReview.find({})
        .sort({ rating: "desc" })
        .populate({
          path: "user",
          select: "firstName lastName email image", // Specify the fields you want to populate from the "Profile" model
        })
        .populate({
          path: "course",
          select: "courseName", //Specify the fields you want to populate from the "Course" model
        })
        .exec()
  
      res.status(200).json({
        success: true,
        data: allReviews,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve the rating and review for the course",
        error: error.message,
      })
    }
  }
