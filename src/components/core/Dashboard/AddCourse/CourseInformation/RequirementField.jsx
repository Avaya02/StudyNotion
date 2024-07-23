import React, { useEffect, useState } from 'react'

const RequirementField = ({name, label, register, errors, setValue, getValues}) => {
    const [requirement, setRequirement] = useState("");
    const [requirementList, setRequirementList] = useState([]);

 
    useEffect(()=> {               //doubt
        register(name, {
            required:true,
            // validate: (value) => value.length > 0
        })
    },[])

    useEffect(()=> {          //DOUBT
        setValue(name, requirementList);
    },[requirementList])

    const handleAddRequirement = () => {  
        if(requirement) {   
            setRequirementList([...requirementList, requirement]);
            //setRequirement("");
        }
    }

    const handleRemoveRequirement = (index) => {    //current list ki copy create kardega in new variable and usme element splice kardenge and then 
        const updatedRequirementList = [...requirementList];
        updatedRequirementList.splice(index, 1);
        setRequirementList(updatedRequirementList);
    }

  return (
    <div>

        <label htmlFor={name}>{label}<sup>*</sup></label>
        <div>
            <input
                type='text'
                id={name}
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}   //
                className='w-full'
            />
            <button
            type='button'
            onClick={handleAddRequirement}
            className='font-semibold text-yellow-50'>
                Add
            </button>
        </div>

        {
            requirementList.length > 0 && (   //As soon as length exceeds 0 we have to show it below the input tag so we mapped it 
                <ul>
                    {
                        requirementList.map((requirement, index) => (
                            <li key={index} className='flex items-center text-richblack-5'>
                                <span>{requirement}</span>
                                <button
                                type='button'
                                onClick={() => handleRemoveRequirement(index)}   //for clear button below requirements 
                                className='text-xs text-pure-greys-300'>
                                    clear
                                </button>
                            </li>
                        ))
                    }
                </ul>
            )
        }
        {errors[name] && (
            <span>
                {label} is required
            </span>
        )}
      
    </div>
  )
}

export default RequirementField
