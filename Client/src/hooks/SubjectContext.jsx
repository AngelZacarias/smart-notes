import React, { createContext, useState } from 'react'

export const SubjectContext = createContext();

const SubjectProvider = (props) => {
    // State to storage the subject Information
    const [subjectInformation, setSubjectInformation] = useState({
        id: '0',
        name: '',
        color: 'primary',
        schedule: [],
    });

    const clearSubjectInformation = () =>{
        setSubjectInformation({
            id: '0',
            name: '',
            color: 'primary',
            schedule: [],
        });
    }

    // Translate the color name for the card into the colors for the dashboard sidebar
    const getColor = () =>{
        if(subjectInformation.color === 'success'){
            return 'green';
        }
        else if(subjectInformation.color === 'info'){
            return 'blue';
        }
        else if(subjectInformation.color === 'warning'){
            return 'orange';
        }
        else if(subjectInformation.color === 'error'){
            return 'red';
        }
        else if(subjectInformation.color === 'rose'){
            return 'rose';
        }
        else{
            return 'primary';
        }
    }

    return ( 
        <SubjectContext.Provider
            value={{
                subjectInformation,
                setSubjectInformation,
                clearSubjectInformation,
                getColor
            }}
        >
            {props.children}
        </SubjectContext.Provider>
    );
}
 
export default SubjectProvider;