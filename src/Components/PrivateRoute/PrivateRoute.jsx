import React, { use, useContext } from 'react'

import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../Contexts/AuthContext';

export default function PrivateRoute({children}) {
    const {user , loading} = use(AuthContext);
    const location = useLocation();
  
   if(loading){
        return <span className='loading loading-spinner loading-xl items-center'></span>
    }


    if(!user){
        return <Navigate state={location?.pathname} to='/login' />;
    }

  return children;
}
