import { useContext, useEffect, useState, type ReactNode } from "react";
import NavigationBar from "./NavigationBar";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

type NavigationControllerProp = {
    children: ReactNode
}

const NavigationController = ({children}: NavigationControllerProp) => {
    const location = useLocation();
    const [currentPath, setCurrentPath] = useState(location.pathname);
    const showNavigationBar = location.pathname !== "/";
    const authContext = useContext(AuthContext);
    const navigage = useNavigate();

    useEffect(() => {
        if (currentPath === "/" && authContext?.user !== null) {
            navigage("/profile");
        }
    }, [authContext]);

    return (
        <div className="flex">
            { showNavigationBar && <NavigationBar/>}
            {children}
        </div>
    );
};

export default NavigationController;