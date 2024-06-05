import React from 'react'
import HeaderDefault from '../../components/HeaderDefault'
import { Outlet } from 'react-router-dom'

const UserInterface = ({user, logout,activeDesactiveAdds,activeAdds}) => {
  return (
    
        <>
            <HeaderDefault user={user} logout={logout} activeDesactiveAdds={activeDesactiveAdds} activeAdds={activeAdds}/> 
            <Outlet/>
        </>
    
  )
}

export default UserInterface