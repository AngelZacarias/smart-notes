import React, { createContext, useState } from 'react'

export const UserContext = createContext();

const UserProvider = (props) => {
    // State to storage the user Information
    const [userInformation, setUserInformation] = useState({
      id: '',
      email: '',
      active: true,
      name: '',
      lastName: '',
    });

    const clearUserInformation = () =>{
      setUserInformation({
        id: '',
        email: '',
        active: true,
        name: '',
        lastName: '',
      });
    }

    //TODO: Optionally we could get the information for this user from DB when setUserId is executed
    const setUserId = (id) =>{
      setUserInformation({
        ...userInformation,
        id: id,
      })
    }

    return ( 
        <UserContext.Provider
            value={{
                userInformation,
                setUserInformation,
                clearUserInformation,
                setUserId,
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
}
 
export default UserProvider;