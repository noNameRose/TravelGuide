import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import AuthContext from "../../contexts/AuthContext";
import DotLoading from "../loading/DotLoading";
import getUserProfile from "../../utils/getUserProfile";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import getAccessToken from "../../utils/getAccessToken";
import { InvalidAccessTokenException } from "../../exceptions/InvalidAccessTokenException";

type User = {
    email: string, 
    name: string
};

export type AuthContextType = {
    user: User | null,
    accessToken: string | null,
    updateAccessToken: (token: string) => void
}

const AuthProvider = ({children}: {children: ReactNode}) => {   
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isloading, setIsLoading] = useState<boolean>(true);
    const loadingPortal = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    const authContextValue = useMemo(() => {
        return {
            user: user,
            accessToken: accessToken,
            updateAccessToken: setAccessToken
        };
    }, [user, accessToken]);

    const fetchUserProfile = async (accessToken: string | null) => {
        setIsLoading(true);
        try {
            const user = await getUserProfile(accessToken);
            setUser({email: user?.email as string, name: user?.name as string});
        }
        catch (exc) {
            if (exc instanceof InvalidAccessTokenException) {
                const accessToken = await getAccessToken();
                setAccessToken(accessToken as string);
            }
            else {
                navigate("/");
            }
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile(accessToken);
    }, [accessToken]);

    useEffect(() => {
        if (isloading) {
            gsap.to(loadingPortal.current, {
                opacity: "1",
                zIndex: "50"
            });
        }
        else {
            gsap.to(loadingPortal.current, {
                opacity: "0",
                zIndex: "-100"
            });
        }
    }, [isloading])

    return (
        <AuthContext
            value={authContextValue}
        >
            <div 
                ref={loadingPortal}
                className="w-screen min-h-screen bg-blue_50 fixed z-50 flex items-center justify-center opacity-100"
            >
                <DotLoading
                    dotColor="bg-blue_400"
                    style={{}}
                />
            </div>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;