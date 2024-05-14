const Profile = require("../models/Profile")
const CourseProgress = require("../models/CourseProgress");
const User = require("../models/User");
const {uploadImageToCloudinary } = require("../utils/imageUploader");

exports.updateProfile = async(req,res) => {
    try{
        const {dateOfBirth ="" , about = "" , contactNumber , gender } = req.body ;
        //get userId

        const id = req.user.id ;  //becuz auth middle ware mai payload ke andar decode pass kraya tha  which also refers to Auth controller line 229 

        if(!dateOfBirth || !gender || !id){
            return res.status(404).json({
                success : false,
                message : "All fields required",
            });
        }

        //FIND PROFILE

        // We do not have profile id, but we have user id and profile id is in user schema in additonal details as a ref 
        // so we use user id to find profile id

    
        const userDetails = await User.findById(id);

         const profileId = userDetails.additionalDetails;  //BECOZ USER SCHEMA MAI additional details data hai jisme Profile ka ref de rekha basically ref
         //  it'll be referring to its ID

         const profileDetails = await Profile.findById(profileId);

         //UPDATE PROFILE
         profileDetails.dateOfBirth = dateOfBirth;
         profileDetails.contactNumber = contactNumber;
         profileDetails.about = about ;
         profileDetails.gender = gender;
         await profileDetails.save();

         return res.status(200).json({
            success : true,
            message : "Profile updated successfully",
            profileDetails,
         })

    }
    catch(error){
        return res.status(500).json({
            success :false,
            message : "Error whilw updating profile, please try again",
        })

    }
}

exports.deleteAccount = async (req,res) =>{
    try{
        const id = req.user.id;

        //validation 
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success : false,
                message : "User not found",
            });
        }
        //delete profile
        await Profile.findByIdAndDelete({ _id : userDetails.additionalDetails});  //DOUBT WHY DID WE USE _ID HERE 

        //delete User 
        await User.findByIdAndDelete({ _id : id});

        //HW : UNROLL USER FROM ALL UNROLLED COURSES
         return res.status(200).json({
            success : true,
            message : "User deleted successfully",
         })

    }
    catch(error){
        res.status(500).json({
            success : false,
            message : "Error while deleting user",
        })

    }
}



exports.getAllUserDetails = async (req, res) => {    //Entire data of a user
    try {
      const id = req.user.id
      const userDetails = await User.findById(id).populate("additionalDetails").exec();  //this line of code means it,ll give all the details of the user
      // and will also give its additional details
      console.log(userDetails);
      res.status(200).json({
        success: true,
        message: "User Data fetched successfully",
        data: userDetails,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate("courses")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};