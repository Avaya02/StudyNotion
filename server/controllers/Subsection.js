const Section = require("../models/Section");
const SubSection =require("../models/SubSection");
const {uploadImageToCloudinary} = require("../utils/imageUploader"); //this is a function so curly braces mai import hoga
require("dotenv").config();


exports.createSubSection = async (req, res) => {
    try {
      // Extract necessary information from the request body
      const { sectionId, title, description } = req.body
      const video = req.files.video
  
      // Check if all necessary fields are provided
      if (!sectionId || !title || !description || !video) {
        return res
          .status(404)
          .json({ success: false, message: "All Fields are Required" });
      }

      //upload video to cloudinary 
      const uploadDetails = await uploadImageToCloudinary( video , process.env.FOLDER_NAME);
      //create a Sub-section

      const subSectionDetails = await SubSection.create({
        title : title,
        description : description,
        timeDuration : `${uploadDetails.duration}`,
        videoUrl : uploadDetails.secure_url, //bcoz upar voh function secure url return karega
      });

      //update section with this subsection objectId
      const updatedSection= await Section.findByIdAndUpdate( {_id : sectionId} ,  //doubt in{ _id : sectionId}
                                                                      { $push : {
                                                                        subSection : subSectionDetails._id,
                                                                      }},
                                                                    {new : true} ,).populate("subSection");

                   //Section ke andar SubSection ka data id ki form mai store hoga
                   //HW : log updated section here ,after adding populate query 
                   
                   return res.status(200).json({
                    success : true,
                    message : "Sub Section created successfully",
                   });
    }
    catch(error){
      console.error("Error creating new sub-section:", error)

      return res.status(500).json({
       
        success : false,
      message : "Error while creating subSection",
      })
      

    }
}

//HW : UPDATE SUBSECTION

exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId,subSectionId , title, description } = req.body

    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()

    const updatedSection = await Section.findById(sectionId).populate("subSection");

    return res.json({
      success: true,
      data : updatedSection,
      message: "Section updated successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    })
  }
}

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    )
    const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" })
    }

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    })
  }
}

//DELETE SUBSECTION 