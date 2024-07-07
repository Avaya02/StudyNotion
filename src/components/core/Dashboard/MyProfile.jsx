import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import IconBtn from '../../common/IconBtn'

const MyProfile = () => {

    const {user} = useSelector((state) => state.profile)
    const navigate = useNavigate();
  return (
    <div className='text-white'>

        <h1>
            My Profile
        </h1>
        
        {/* section 1 */}
        <div>
            <div>
                <img 
                src={user?.image}
                alt={`profile-${user?.firstName}`}
                className='aspect-square w-[78px] rounded-full object-cover' />
                <div>
                    <p> {user?.firstName + " " + user?.lastName} </p>
                    <p> {user?.email}</p>
                </div>
            </div>
            <IconBtn
                text="Edit"
                onclick={() => {
                    navigate("/dashboard/settings")
                }} >

            </IconBtn>
        </div>

        {/* section 2 */}
        <div>
            <div>
                <p>About</p>
                <IconBtn
                text="Edit"
                onclick={() => {
                    navigate("/dashboard/settings")
                }} />
            </div>
            <p> {user?.additionalDetails?.about  ??  "Write Something about Yourself"}</p>
        </div>

        {/* section 3 */}
        
      
    </div>
  )
}

export default MyProfile