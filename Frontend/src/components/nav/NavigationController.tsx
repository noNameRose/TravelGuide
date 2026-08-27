import type { ReactNode } from "react";
import NavigationBar from "./NavigationBar";
import { useLocation } from "react-router-dom";

type NavigationControllerProp = {
    children: ReactNode
}

const NavigationController = ({children}: NavigationControllerProp) => {
    const location = useLocation();
    const showNavigationBar = location.pathname === "/";

    return (
        <div>
            { showNavigationBar && <NavigationBar/>}
            {children}
        </div>
    );
};

export default NavigationController;