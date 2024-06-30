import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup"
import OpenRoute from "./components/core/Auth/OpenRoute"
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import UpdatePassword from "./pages/UpdatePassword";
import About from "./pages/About";


function App() {
  return (
   <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
   
   <Navbar/>
   
    <Routes>
    <Route path="/" element={<Home/>} />

    <Route
          path="signup"
          element={
           
              <Signup/>
           
          }
        />
    <Route
          path="login"
          element={
            
              <Login/>
           
          }
        />

<Route
          path="forgot-password"
          element={
           
             <ForgotPassword/>
           
          }
        />  

    <Route
          path="verify-email"
          element={
            
             <VerifyEmail/>
           
          }
        />  

        <Route
          path="update-password/:id"
          element={
           
              <UpdatePassword/>
            
          }
        />  

        <Route  
        path="about"
        element = {
         <About/>
        }
        />

        


    </Routes>
   </div>
  );
}

export default App;
