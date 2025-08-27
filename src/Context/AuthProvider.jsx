import React from 'react';
import { AuthContext } from './AuthContext';

const AuthProvider = ({children}) => {
    const data ={
        name:'radin'
    }

    return (
        <AuthContext value={data}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;