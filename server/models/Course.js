const  mongoose = require("mongoose")

const courseSchema = mongoose.Schema({
    courseName :{
        type : String,
    },
    courseDescription :{
        type : String,
    },
    instructor:{
        type : mongoose.Schema.Types.ObjectId,
        ref :"User",
        required : true,
    },
    whatYouWillLearn :{
        type : String,

    },

    courseContent :[
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Section",
    }
],
 
  ratingAndReview : [ {
    type : mongoose.Schema.Types.ObjectId,
    ref : "RatingAnd Review",
  }
  ],

  price : {
    type : Number,
  },

  thumbnail :{
    type : String,
  },

  tag :{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Tag",
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "Category",
  },
  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
})