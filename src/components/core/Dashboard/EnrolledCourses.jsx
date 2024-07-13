import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI';
import ProgressBar from '@ramonak/react-progress-bar';

const EnrolledCourses = () => {

    const {token}  = useSelector((state) => state.auth);

    const [enrolledCourses, setEnrolledCourses] = useState(null);


    const getEnrolledCourses = async() => {  //Made Api function call and passed the function name in useEffect hook 
        try{
            const response = await getUserEnrolledCourses(token);  //was imported from services 
            setEnrolledCourses(response);
        }
        catch(error) {
            console.log("Unable to Fetch Enrolled Courses");
        }
    }

    useEffect(()=> {
        getEnrolledCourses();
    },[]);


  return (
    <div className='text-white'>

        <div>Enrolled Courses</div>
        {
            !enrolledCourses ? (<div>
                Loading...
            </div>)   //below logic is for if enrolled courses exist but user hasnt enrolled in any course yet 
            : !enrolledCourses.length ? (<p>You have not enrolled in any course yet</p>)
            : (
                <div>
                    <div>
                        <p>Course Name</p>
                        <p>Durations</p>
                        <p>Progress</p>
                    </div>
                    {/* Cards shure hote h ab */}
                    {
                        enrolledCourses.map((course,index)=> (
                            <div key={index}>
                                <div>
                                    <img  src={course.thumbnail}/>
                                    <div>
                                        <p>{course.courseName}</p>
                                        <p>{course.courseDescription}</p>
                                    </div>
                                </div>

                                <div>
                                    {course?.totalDuration}
                                </div>

                                <div>
                                {/* for now just assume this data is coming no need to stress about and test, it'll be cleared later by sir*/}

                                    <p>Progress: {course.progressPercentage || 0}%</p>

                                    <ProgressBar 
                                  
                                     //these are its attributes
                                        completed={course.progressPercentage || 0}
                                        height='8px'
                                        isLabelVisible={false}
                                        />
                                </div>
                            </div>
                        ))
                    }
                </div>
            )
        }
      
    </div>
  )
}

export default EnrolledCourses
