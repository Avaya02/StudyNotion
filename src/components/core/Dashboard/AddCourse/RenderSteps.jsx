import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import CourseBuilderForm from './CourseBuilder/CourseBuilderForm';
import CourseInformationForm from './CourseBuilder/CourseBuilderForm';

const RenderSteps = () => {
    const {step} = useSelector((state) => state.course);

    const steps = [
        {
            id: 1,
            title: "Course Information",
        },
        {
            id: 2,
            title: "Course Builder",
        },
        {
            id: 3,
            title: "Publish",
        },
    ];

    return (
        <>
            <div>
                {steps.map((item) => (
                    <div key={item.id}>  {/* Add a unique key prop here */}
                        <div className={`${step === item.id   //conditional css rendering for steps line 
                            ? "bg-yellow-900 border-yellow-50 text-yellow-50"
                            : "border-richblack-700 bg-richblack-800 text-richblack-300"}`}>

                            {
                                step > item.id ? (<FaCheck />) : (item.id) //if step completed, show a tick
                            }

                        </div>
                    </div>
                ))}
            </div>
            <div>
                {steps.map((item) => (
                    <div key={item.id}>  {/* Add a unique key prop here */}
                        <p>{item.title}</p>
                    </div>
                ))}
            </div>

            {/*STEPWISE FORM RENDERING*/}
            {step === 1 && <CourseInformationForm />}
            {/* {step === 2 && <CourseBuilderForm />} */}
            {/* {step===3 && <PublishCourse/>} */}
        </>
    );
}

export default RenderSteps;
