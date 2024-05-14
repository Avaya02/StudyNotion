const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req,res) =>{
    try{
        const{sectionName , courseId} = req.body;
       if(!sectionName || !courseId){
        return res.status(400).json({
            success : false,
            message : "Missing properties",
        });
       }
      //create section
       const newSection = await Section.create({sectionName});
       //update course with section object Id

       const updatedCourseDetails = await  Course.findByIdAndUpdate(
        courseId,
        {
            $push : {
                courseContent : newSection._id,
            },  
        },
        {new : true},
       );
       //HW : USE POPULATE TO REPLACE SECTIONS/SUBSECTIONS BOTH IN UPDATEDCOURSEdETAILS 
       
       return res.status(200).json({
        success : true,
        message : "Section created successfully",
        updatedCourseDetails,

       })


    }
    catch(error){
        return res.status(500).json({
            success : false,
            message :"Unable to create Section, please try again",
            error : error.message,
        })

    }
}

exports.updateSection = async (req,res) =>{
    try{
        const{sectionName , sectionId} = req.body;

        if(!sectionName || !sectionId){
            return res.status(400).json({
                success : false,
                message : "Missing properties",
            });
        }

        //update data
        const section = await Section.findByIdAndUpdate(sectionId , {sectionName} , {new:true}); //id se find kia and then sections name update kardia
        return res.json({
            success : true,
            message : "Section updated successfully",
        })

    }

    catch(error){
        return res.status(500).json({
            success : false,
            message :"Unable to update Section, please try again",
            error : error.message,
        })

    }
}

exports.deleteSection = async(req,res) =>{
    try{
        const{sectionId }  = req.params;

        //use find By id and delete
         await Section.findByIdAndDelete(sectionId);
         //TODO : WE ALSO NEED TO DELETE THE ENTRY FROM THE COURSE sCHEMA 

        return res.status(200).json({
            success : false,
            message : "Section deleted successfully",
        })


    }
    catch(error){
        return res.status(500).json({
            success : false,
            message :"Unable to delete Section, please try again",
            error : error.message,
        })

    }
}