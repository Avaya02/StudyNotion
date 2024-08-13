import React, { useEffect, useState } from 'react'
import RatingStars from '../../common/RatingStars'
import GetAvgRating from '../../../utils/avgRating';
import { Link } from 'react-router-dom';

const Course_Card = ({course, Height}) => {


    const [avgReviewCount, setAvgReviewCount] = useState(0);

    useEffect(()=> {
        const count = GetAvgRating(course.ratingAndReviews);
        setAvgReviewCount(count);
    },[course])


    
  return (
    <div>
        <Link to={`/courses/${course._id}`}>  {/*Course on clicking on whole card it'll navigate to the route*/}
            <div>
                <div>
                    <img 
                        src={course?.thumbnail}
                        alt='course ka thumbnail'
                        className={`${Height} w-full rounded-xl object-cover`}
                    />
                </div>
                <div>
                    <p>{course?.courseName}</p>
                    <p>{course?.instructor?.firstName} {course?.instructor?.lastName} </p> {/*Because instructor in course schema has ref to user , which has first name */}
                        {/*Also we cannot directly access first name of instructor so we drilled*/}

                    <div className='flex gap-x-3'>

                        <span>{avgReviewCount || 0}</span>

                        <RatingStars Review_Count={avgReviewCount} />
                        
                        <span>{course?.ratingAndReviews?.length} Ratings</span>
                    </div>
                    <p>{course?.price}</p>
                </div>
            </div>
        </Link>

      
    </div>
  )
}

export default Course_Card
