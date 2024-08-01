const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const mongoose = require("mongoose");

//create course handler

exports.createCourse = async (req, res) => {
  try {

   
// Get all required fields from request body
let {
    courseName,
    courseDescription,
    whatYouWillLearn,
    price,
    tag,
    category,
    status,
    instructions,
} = req.body;

    // get thumbnail
    const thumbnail = req.files.thumbnailImage;
    console.log(thumbnail);

    // Check if any of the required fields are missing
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }

    // check for instructor
    const userId = req.user.id;

    // const instructorDetails = await User.findById({ userId });
    const instructorDetails = await User.findById(userId, {
        accountType: "Instructor",
    });

    // TODO : VERIFY THAT userId and Instructor id are same or different ?

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found",
      });
    }

      // Convert category to ObjectId if it is not already
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Category ID",
        });
    }

    // //check given tag is valid or not
    console.log(category);
    const categoryDetails = await Category.findById(category);
    console.log(categoryDetails);
		if (!categoryDetails) {
			return res.status(404).json({
				success: false,
				message: "Category Details Not Found",
			});
		}

    // const tagDetails = await User.findById(tag); //becoz in COurse Schema tag was passed as an ID only not a data

    // if (!tagDetails) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Tag details not found",
    //   });
    // }
    //upload image to cloudinary
    const thumbnailImage = await uploadImagetoCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    ///create an entry for nEW COURSE
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatWillYouLearn : whatYouWillLearn,
      price,
      tag: tag,
      category : categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status : status,
      instructions : instructions,
    });
    //add the new course to the user Schema of intructor
    await User.findByIdAndUpdate(
      //DOUBT IN THIS FUNCTIONS
      { id: instructorDetails._id }, //DOUBT IN THIS FUNCTIONS
      {
        //DOUBT IN THIS FUNCTIONS
        $push: {
          //DOUBT IN THIS FUNCTIONS
          courses: newCourse._id, //DOUBT IN THIS FUNCTIONS
        }, //DOUBT IN THIS FUNCTIONS
      },
      { new: true }
    );

    //update Tag schema : TODO : HW'

    return res.status(200).json({
      success: true,
      message: "Course created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in creating course",
    });
  }
};

//getAll courses handler function
exports.getAllCourses = async (req, res) => {
  //DOUBT
  try {
    const allCourses = await Course.find(
      {},
      {
        //DOUBT
        courseName: true, //DOUBT
        price: true, //DOUBT
        thumbnail: true, //DOUBT
        instructor: true, //DOUBT
        ratingAndReviews: true, //DOUBT
        studentsEnrolled: true, //DOUBT
      }
    )
      .populate("instructor") //DOUBT
      .exec(); //DOUBT

    return res.status(200).json({
      success: true,
      message: "Data for all courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return (
      res.status(500),
      json({
        success: false,
        message: "Cannot fetch course data",
      })
    );
  }
};

//get courseDetails

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;

    //find course details

    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor", //populated the intructor field which has ref to user  and also poplate the additionalDetails in user
        populate: {
          //NESTED POPULATE
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        //this is basically like populate drilling
        path: "courseContent", //courseContent is ref to Sections and Sections is ref to subSections
        populate: {
          path: "subSection",
        },
      })
      .exec();

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with ${courseId}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while getting All course details",
    });
  }
};
