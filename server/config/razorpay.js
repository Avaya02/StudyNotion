const Razorpay = require("razorpay");

exports.instance = new Razorpay({    //this instance will be imported in Payments controller
    key_id : process.env.RAZORPAY_KEY,
    key_secret : process.env.RAZORPAY_SECRET
})