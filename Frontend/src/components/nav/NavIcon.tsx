import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export type IconName = "profile" | "explore" | "diary";

type NavIconType = {
    name: IconName,
    path: string,
    className: string
}

const NavIcon = ({name, path, className}: NavIconType) => {
    let icon = null;
    const svgClass = "w-full h-full";
    const pathClass = "fill-blue_50";
    const iconWrapper = useRef<HTMLDivElement | null>(null);
    const [isHover, setIsHover] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isHover) {
            gsap.to(iconWrapper.current, {
                scale: 1.2,
                ease: "power4.out"
            });
        }
        else {
            gsap.to(iconWrapper.current, {
                scale: 1,
                ease: "power4.out"
            })
        }
    }, [isHover]);

    if (name === "profile") {
        icon = (
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 640 640"
                className={svgClass}
            >
                <path 
                    className={pathClass}
                    d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z"/>
            </svg>
        );
    }
    if (name === "explore") {
        icon = (
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 640 640"
                className={svgClass}
            >
                <path 
                    className={pathClass}
                    d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z"/>
            </svg>
        );
    }
    if (name === "diary") {
        icon = (
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                className={svgClass}
            >
                <path 
                    className={pathClass}
                    d="M8 2V22H4V18H2V16H4V13H2V11H4V8H2V6H4V2H8ZM20.0049 2C21.1068 2 22 2.89821 22 3.9908V20.0092C22 21.1087 21.1074 22 20.0049 22H10V2H20.0049Z">
                </path>
            </svg>
        );
    }
    return (
        <div 
            className={className}
            ref={iconWrapper}
            onMouseOver={() => setIsHover(true)}
            onMouseOut={() => setIsHover(false)}
            onClick={() => navigate(path)}
        >
            {icon}
        </div>
    );
};

export default NavIcon;

