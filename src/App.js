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
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Contact from "./pages/Contact"
import MyProfile from "./components/core/Dashboard/MyProfile"
import Dashboard from "./pages/Dashboard";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Error from "./pages/Error"
import Cart from "./components/core/Dashboard/Cart";
import Settings from "./components/core/Dashboard/Settings"


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

        <Route path="/contact" element={<Contact/>}/>

<Route 
      element={   // //In this part we have nested routes and parent route is private which means only authenticated users can access nested routes
        <PrivateRoute>
          <Dashboard />
         </PrivateRoute>
      }
    >
      <Route path="dashboard/my-profile" element={<MyProfile />} />
      <Route path="dashboard/settings" element={<Settings />} />
      <Route path="dashboard/cart" element={<Cart/>} />   {/*In Cart folder , Index.js in defined and exported as Cart only*/}
      <Route path="dashboard/enrolled-courses" element={<EnrolledCourses/>}/>

    </Route>

        <Route path="*" element={<Error/>}/>


    </Routes>
   </div>
  );
}

export default App;
