const Category = require("../models/Category");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

exports.createCategory= async (req,res) =>{
    try{
        const { name, description} = req.body;

        // if(!name || !description)
        if(!name){
            return res.status(400).json({
                success :false,
                message : "All fields are required",
            })

        }
         //create entry in DB
         const categoryDetails = await Category.create({
            name : name,
            description : description,
                
         });
         console.log(categoryDetails);
         return res.status(200).json({
          success : true,
          message : "Categories create Successfully",

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
        const allCategory = await Category.find({} );     //DOUBT---->The empty object {} as the first argument 
        //means it's not applying any filters to the query, so it will return all documents in the collection.

        // {name: true, description: true}: This part specifies the projection for the query. Projection in MongoDB determines which fields to include or exclude
        // from the result set. In this case, it's specifying to include only the "name" and "description" fields in the returned documents.
        // The value true indicates that these fields should be included, while false would indicate exclusion.

        res.status(200).json({
            success : true,
            message : "All Category return successfully",
           allCategory,
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
       populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec()

      //validation 
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      // Handle the case when there are no courses
      if (selectedCategory.courses.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }

      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })

      
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]  //getRandomInt function is defined on top
          ._id
      )
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec()



      //get top selling courses  HW 
 
 // Get top-selling courses across all categories (Added afterwards)
          const allCategories = await Category.find()
          .populate({
            path: "courses",
            match: { status: "Published" },
            populate: {
              path: "instructor",
          },
          })         
          .exec()

         const allCourses = allCategories.flatMap((category) => category.courses)  //doubt 
         const mostSellingCourses = allCourses
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 10)
// console.log("mostSellingCourses COURSE", mostSellingCourses)
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