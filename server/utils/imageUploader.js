const cloudinary = require("cloudinary").v2  

exports.uploadImageToCloudinary = async(file , folder , height, quality ) =>{
    const options = {folder};

    if(height){   //if height comes in paramter include it in options
        options.height = height ;
    }

    if(quality){   //if quality comes in paramter include it in options
        options.quality = quality;
    }

    options.resource_type = "auto";   //to be memorized 

    return await cloudinary.uploader.upload(file.tempFilePath , options);  //to be memorized 
    
}