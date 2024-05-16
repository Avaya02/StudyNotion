import React from 'react'
import {Link} from "react-router-dom"

const Button = ({children, active, linkto}) => {
  return (
    <Link to={linkto}>

        <div className={`text-center text-[13px] px-6 py-3 rounded-md font-bold
        ${active ? "bg-yellow-50 text-black":" bg-richblack-800"}  
        hover:scale-95 transition-all duration-200
        `}>    {/*Here we used conditional rendering inside css for boolean variable for button color , children is text inside it and link is route  */}
            {children}
        </div>

    </Link>
  )
}

export default Button

