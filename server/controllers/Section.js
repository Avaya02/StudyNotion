const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

// exports.createSection = async (req,res) =>{
//     try{
//         const{sectionName , courseId} = req.body;
//        if(!sectionName || !courseId){
//         return res.status(400).json({
//             success : false,
//             message : "Missing properties",
//         });
//        }
//       //create section
//        const newSection = await Section.create({sectionName});
//        //update course with section object Id

//        const updatedCourseDetails = await  Course.findByIdAndUpdate(
//         courseId,
//         {
//             $push : {
//                 courseContent : newSection._id,
//             },  
//         },
//         {new : true},
//        );
//        //HW : USE POPULATE TO REPLACE SECTIONS/SUBSECTIONS BOTH IN UPDATEDCOURSEdETAILS 
       
//        return res.status(200).json({
//         success : true,
//         message : "Section created successfully",
//         updatedCourseDetails,

//        })


//     }
//     catch(error){
//         return res.status(500).json({
//             success : false,
//             message :"Unable to create Section, please try again",
//             error : error.message,
//         })

//     }
// }

exports.createSection = async (req, res) => {
	try {
		// Extract the required properties from the request body
		const { sectionName, courseId } = req.body;

		// Validate the input
		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		}

		// Create a new section with the given name
		const newSection = await Section.create({ sectionName });

		// Add the new section to the course's content array
		const updatedCourse = await Course.findByIdAndUpdate(
			courseId,
			{
				$push: {
					courseContent: newSection._id,
				},
			},
			{ new: true }
		)
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

		// Return the updated course object in the response
		res.status(200).json({
			success: true,
			message: "Section created successfully",
			updatedCourse,
		});
	} catch (error) {
		// Handle errors
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};


// exports.updateSection = async (req,res) =>{
//     try{
//         const{sectionName , sectionId} = req.body;

//         if(!sectionName || !sectionId){
//             return res.status(400).json({
//                 success : false,
//                 message : "Missing properties",
//             });
//         }

//         //update data
//         const section = await Section.findByIdAndUpdate(sectionId , {sectionName} , {new:true}); //id se find kia and then sections name update kardia
//         return res.json({
//             success : true,
//             message : "Section updated successfully",
//         })

//     }

//     catch(error){
//         return res.status(500).json({
//             success : false,
//             message :"Unable to update Section, please try again",
//             error : error.message,
//         })

//     }
// }

// UPDATE a section
exports.updateSection = async (req, res) => {
	try {
		const { sectionName, sectionId,courseId } = req.body;
		const section = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);

		const course = await Course.findById(courseId)
		.populate({    //was not in previous babbar code
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();     //was not in previous babbar code

		res.status(200).json({
			success: true,
			message: section,
			data:course,   //changed afterwards
		});
	} catch (error) {
		console.error("Error updating section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

exports.deleteSection = async(req,res) =>{
    try{
        const{sectionId, courseId }  = req.body;
        console.log(sectionId, courseId);

        

       await Course.findByIdAndUpdate(courseId, {            //updated while doing frontend
        $pull: {            //updated while doing frontend
            courseContent: sectionId,            //updated while doing frontend
        }
    })
    //use find By id and delete
    const section =   await Section.findByIdAndDelete(sectionId);
    console.log(sectionId, courseId);


       if(!section){
        return res.status(404).json({
            success : false,
            message : "Section not found",

        })
       }
       //delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});
         //TODO : WE ALSO NEED TO DELETE THE ENTRY FROM THE COURSE sCHEMA 
         await Section.findByIdAndDelete(sectionId);


		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

        return res.status(200).json({
            success : true,
            message : "Section deleted successfully",
            data : course ,  //relook 
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