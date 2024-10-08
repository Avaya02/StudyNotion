import React from 'react'
import { FaArrowRight } from "react-icons/fa"
import { Link } from 'react-router-dom'
import CTAButton from "../components/core/HomePage/Button"
import HighlightText from '../components/core/HomePage/HighlightText'
import Banner from '../assets/Images/banner.mp4'
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import TimelineSection from '../components/core/HomePage/TimelineSection'
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'
import InstructorSection from '../components/core/HomePage/InstructorSection'
import Footer from '../components/common/Footer'
import ExploreMore from '../components/core/HomePage/ExploreMore'
import ReviewSlider from "../components/common/ReviewSlider"



const Home = () => {
  return (
    <div>
    <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white">
        {/* Become a Instructor Button */}
        <Link to={"/signup"}>
          <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        <div className='text-center text-4xl font-semibold mt-7'>
            Empower Your Future with
            <HighlightText text={"Coding Skills"} />
        </div>

        <div className=' mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
            With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
        </div>
        <div className='flex flex-row gap-7 mt-8'>
            <CTAButton active={true} linkto={"/signup"}>  {/* active is a boolean variable which is passed as props in CTA component to decide button color*/}
                Learn More
            </CTAButton>

            <CTAButton active={false} linkto={"/login"}> 
                Book a Demo
            </CTAButton>
        </div>

        <div className='mx-3 my-12 shadow-blue-200'>
            <video
            muted   
            loop
            autoPlay
            >
            <source  src={Banner} type="video/mp4" />
            </video>
        </div>

         {/* Code Section 1 */}
         <div>
            <CodeBlocks       //made a component of it because of being used multiple times
                position={"lg:flex-row"}    
                heading={
                    <div className='text-4xl font-semibold'>
                        Unlock Your
                        <HighlightText text={"coding potential "}/>
                         with our online courses
                    </div>
                }
                subheading = {
                    "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                }
                ctabtn1={
                    {
                        btnText: "Try it yourself",
                        linkto: "/signup",
                        active: true,
                    }
                }
                ctabtn2={
                    {
                        btnText: "Learn more",
                        linkto: "/login",
                        active: false,
                    }
                }

                codeblock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>/nnav><href="one/">One</a><href="two/">Two</\na><ahref="three/">Three</a>\n/nav>`}
                codeColor={"text-yellow-25"}
            />
        </div>

  {/* Same copy of the Code section 1 but flex row reverse for exchanging position of components}

      {/* Code Section 2 */}    
      <div>
            <CodeBlocks 
                position={"lg:flex-row-reverse"}
                heading={
                    <div className='text-4xl font-semibold'>
                        Start
                        <HighlightText text={"Coding in seconds "}/>
                        with our online courses
                    </div>
                }
                subheading = {
               "Go ahead give it a try . Our hands-on learning environment means you'll be writing real code from your very first lesson "                }
                ctabtn1={
                    {
                        btnText: "Continue Lesson",
                        linkto: "/signup",
                        active: true,
                    }
                }
                ctabtn2={
                    {
                        btnText: "Learn more",
                        linkto: "/login",
                        active: false,
                    }
                }

                codeblock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>/nnav><href="one/">One</a><href="two/">Two</\na><ahref="three/">Three</a>\n/nav>`}

                codeColor={"text-yellow-25"}
            />

           
        </div>
        <ExploreMore/>  {/*Quite difficult*/}

     

     {/*Section 2*/}

        <div className='bg-pure-greys-5 text-richblack-700'>
            <div className='homepage_bg h-[310px]'>  {/* defined its css in App.css*/}

                <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto'>
                    <div className='h-[150px]'></div>
                    <div className='flex flex-row gap-7 text-white '>
                        <CTAButton active={true} linkto={"/signup"}>
                            <div className='flex items-center gap-3' >
                                Explore Full Catalog
                                <FaArrowRight />
                            </div>
                            
                        </CTAButton>
                        <CTAButton active={false} linkto={"/signup"}>
                            <div>
                                Learn more
                            </div>
                        </CTAButton>
                    </div>

                </div>


            </div>

            <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>

                <div className='flex flex-row gap-5 mb-10 mt-[95px]'>
                    <div className='text-4xl font-semibold w-[45%]'>
                        Get the Skills you need for a
                        <HighlightText text={"Job that is in demand"} />
                    </div>

                    <div className='flex flex-col gap-10 w-[40%] items-start'>
                    <div className='text-[16px]'>
                    The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                    </div>
                    <CTAButton active={true} linkto={"/signup"}>
                        <div>
                            Learn more
                        </div>
                    </CTAButton>
                    </div>

                </div>
                
                

                <TimelineSection />

              <LearningLanguageSection/>    {/*HW*/}

            </div>

            
      </div>
       {/*Section 3 */}
       <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white'>

<InstructorSection/>

  {/* Reviws from Other Learner */}
  <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        {/* <ReviewSlider /> */}
</div>


{/*Footer */}
<Footer />
      


        
       </div>
      
    </div>
  )
}

export default Home
