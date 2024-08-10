const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const mongoose = require("mongoose");
const Section = require("../models/Section");

//create course handler

exports.createCourse = async (req, res) => {
  try {

   
// Get all required fields from request body
let {
    courseName,
    courseDescription,
    whatYouWillLearn,
    price,
    tag : _tag,            //changed to this afterwards
    category,
    status,
    instructions : _instructions,   //changed to this afterwards
} = req.body;

    // get thumbnail
    const thumbnail = req.files.thumbnailImage;

    // Convert the tag and instructions from stringified Array to Array
    const tag = JSON.parse(_tag)
    const instructions = JSON.parse(_instructions)

    console.log("tag", tag)
    console.log("instructions", instructions)

    // Check if any of the required fields are missing
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag.length ||
      !thumbnail ||
      !category  ||
      !instructions
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }

    if (!status || status === undefined) {              //added afterwards   
      status = "Draft"             //added afterwards 
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
    const thumbnailImage = await uploadImageToCloudinary(
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
       tag,
      category : categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status : status,
       instructions,
    });
    //add the new course to the user Schema of intructor
    await User.findByIdAndUpdate(
      //DOUBT IN THIS FUNCTIONS
      { _id: instructorDetails._id }, //DOUBT IN THIS FUNCTIONS
      {
        //DOUBT IN THIS FUNCTIONS
        $push: {
          //DOUBT IN THIS FUNCTIONS
          courses: newCourse._id, //will push new coursw which was created above's id in the courses of UserSchema
        }, //DOUBT IN THIS FUNCTIONS
      },
      { new: true }
    );

    //update Category  schema : TODO : HW'
    // add new course to Categories 
    await User.findByIdAndUpdate(
      {
        _id : categoryDetails._id
        // _id : category
      },
      {
				$push: {
					courses: newCourse._id, // will push new coursw which was created above's id in the courses of UserSchema
				},
			},
			{ new: true }
    );

    return res.status(200).json({
      success: true,
      data : newCourse,
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
      // {},   Earlier

      { status: "Published" },   //babbar added afterwards 
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
          select: "-videoUrl",
        },
      })
      .exec();

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with ${courseId}`,
      });
    }

     // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0                                  //Added afterwards
    courseDetails.courseContent.forEach((content) => {                         //Added afterwards
      content.subSection.forEach((subSection) => {                         //Added afterwards
        const timeDurationInSeconds = parseInt(subSection.timeDuration)                         //Added afterwards
        totalDurationInSeconds += timeDurationInSeconds                         //Added afterwards
      })                         //Added afterwards
    })                         //Added afterwards

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)                         //Added afterwards


    return res.status(200).json({
    success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while getting All course details",
    });
  }
};



// Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key])
        } else {
          course[key] = updates[key]
        }
      }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}
// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}
