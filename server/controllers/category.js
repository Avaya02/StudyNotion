const Category = require("../models/Category");

exports.createCategory= async (req,res) =>{
    try{
        const { name, description} = req.body;

        if(!name || !description){
            return res.status(400)({
                success :false,
                message : "All fields are required",
            })

        }
         //create entry in DB
         const categoryDetails = await Category.create({
            name : name,
            description : description,
                
         });

    }

    catch(error){
        return res.status(500).json({
            success : false,
            message : error.message,
        })
    }
}

//get All category handler function 

exports.showAllCategories = async(req,res) =>{
    try{
        const allCategory = await Category.find({} , {name : true , description : true});     //DOUBT---->The empty object {} as the first argument 
        //means it's not applying any filters to the query, so it will return all documents in the collection.

        // {name: true, description: true}: This part specifies the projection for the query. Projection in MongoDB determines which fields to include or exclude
        // from the result set. In this case, it's specifying to include only the "name" and "description" fields in the returned documents.
        // The value true indicates that these fields should be included, while false would indicate exclusion.

        res.status(200).json({
            success : true,
            message : "All Category return successfully",
            allTags,
        })

    }
    catch(error){
        return res.status(500).json({
            success : false,
            message : error.message,
        })
    }
}


exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body

      //get courses for specified category 
           
      //whichever category the user selects the function will search by id and give the answer and as courses are as a ref in it we populate the 
      // course data in it to show the courses of the respective category 
      const selectedCategory = await Category.findById(categoryId).   
                                                      populate("courses").
                                                      exec();

      //validation 
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }

      //get courses for different categories 
      const differentCategory = await Category.find({              //DOUBT--WILL BE CLEARED IN TESTING 
        _id : {$ne : categoryId},        //   ne is not equal to  AND eq is equal  to 

    }).populate("courses").exec();



      //get top selling courses



      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
}