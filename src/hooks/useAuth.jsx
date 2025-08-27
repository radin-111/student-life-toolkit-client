import React, { use } from 'react';
import { AuthContext } from '../Context/AuthContext';

const useAuth = () => {
    
    const info = use(AuthContext);

    return info;

};

export default useAuth;