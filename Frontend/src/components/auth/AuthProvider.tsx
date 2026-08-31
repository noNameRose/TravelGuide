import { useEffect, useMemo, useState, type ReactNode } from "react";
import AuthContext from "../../contexts/AuthContext";

type User = {
    email: string, 
    name: string
};

export type AuthContextType = {
    user: User | null,
    accessToken: string | null
}

const AuthProvider = ({children}: {children: ReactNode}) => {   
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const authContextValue = useMemo(() => {
        return {
            user: user,
            accessToken: accessToken
        };
    }, [user, accessToken]);

    useEffect(() => {
        
    });
    return (
        <AuthContext
            value={authContextValue}
        >
            {children}
        </AuthContext>
    );
};

export default AuthProvider;