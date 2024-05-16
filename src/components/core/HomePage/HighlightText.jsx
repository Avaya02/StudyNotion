import React from 'react'

const HighlightText = ({text}) => {
  return (
    <span className='font-bold text-richblue-200'>
        {" "}      {/* For space in text */}
        {text}
    </span>
  )
}

export default HighlightText
