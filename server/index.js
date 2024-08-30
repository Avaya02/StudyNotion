const express = require("express");
const app = express();

const userRoutes =require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/course");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.dbConnect();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		// origin:"https://studynotion-backend-n970.onrender.com",
		origin : "https://study-notion-mocha-xi.vercel.app",
		credentials:true,
	})
)

// const allowedOrigins = [
// 	 "https://studynotion-frontend-n970.onrender.com",
// 	"https://study-notion-mocha-xi.vercel.app/",
// 	"http://localhost:3000", // for local development
// ];

// app.use(
// 	cors({
// 		origin: function (origin, callback) {
// 			if (!origin || allowedOrigins.indexOf(origin) !== -1) {
// 				callback(null, true);
// 			} else {
// 				callback(new Error("Not allowed by CORS"));
// 			}
// 		},
// 		credentials: true,
// 	})
// );


app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
//cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);   //auth for user routes 
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);


//def route

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})

