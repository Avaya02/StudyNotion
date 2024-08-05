import React from 'react'
import IconBtn from './IconBtn'

const ConfirmationModal = ({modalData}) => {
  return (

//inset-0: This shorthand class applies top-0, right-0, bottom-0, and left-0 properties. Essentially, it stretches the element to cover the entire viewport.

// !mt-0:  this overrides other margin top values if applied 

//backdrop-blur-sm:  This applies a small blur effect to the area behind the element. It uses the CSS backdrop-filter property to create this effect.



    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">

      <div className="w-11/12 max-w-[350px] rounded-lg border border-richblack-400 bg-richblack-800 p-6">

        <p className="text-2xl font-semibold text-richblack-5">

          {modalData?.text1}
        </p>
        <p className="mt-3 mb-5 leading-6 text-richblack-200">
          {modalData?.text2}
        </p>
        <div className="flex items-center gap-x-4">

          <IconBtn  //yeh common folder mai hai cuz it's used multiple times by passing handlers and text 

            onclick={modalData?.btn1Handler}
            text={modalData?.btn1Text}
          />
          <button
            className="cursor-pointer rounded-md bg-richblack-200 py-[8px] px-[20px] font-semibold text-richblack-900"
            onClick={modalData?.btn2Handler}
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
