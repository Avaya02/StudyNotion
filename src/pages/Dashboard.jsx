import React from 'react'
import { useSelector } from 'react-redux'
import {Outlet} from "react-router-dom"
import Sidebar from '../components/core/Dashboard/Sidebar'

const Dashboard = () => {

    const {loading: authLoading} = useSelector( (state) => state.auth );
    const {loading: profileLoading} = useSelector( (state) => state.profile );

//     These lines are using the useSelector hook from react-redux to access specific pieces of state from the Redux store.
// Breakdown
// useSelector Hook:

// The useSelector hook allows you to extract data from the Redux store state using a selector function. It subscribes to the Redux store and runs the selector function whenever an action is dispatched.
// State Selection:

// In both lines, the state is being accessed and destructured to retrieve specific values.
// Destructuring and Renaming:

// Destructuring: The syntax {loading: authLoading} and {loading: profileLoading} is used to destructure the loading property from the auth and profile slices of the state, respectively.
// Renaming: The destructured loading property is being renamed to authLoading and profileLoading for easier reference in the component.



    if(profileLoading || authLoading) {
        return (
            <div className='mt-10'>
                Loading...
            </div>
        )
    }


  return (
    <div className='relative flex min-h-[calc(100vh-3.5rem)] bg-richblack-400'>
        <Sidebar />
        <div className='h-[calc(100vh-3.5rem)] overflow-auto'>
            <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
                <Outlet />
            </div>
        </div>
    </div>
  )
}

export default Dashboard
