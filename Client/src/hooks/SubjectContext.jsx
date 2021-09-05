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

    return ( 
        <SubjectContext.Provider
            value={{
                subjectInformation,
                setSubjectInformation,
                clearSubjectInformation
            }}
        >
            {props.children}
        </SubjectContext.Provider>
    );
}
 
export default SubjectProvider;