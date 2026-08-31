import gsap from "gsap";
import { useEffect, useRef, type CSSProperties } from "react";

const DotLoading = ({dotColor, style}: {dotColor: string, style: CSSProperties}) => {
    const dot1 = useRef<HTMLDivElement | null>(null);
    const dot2 = useRef<HTMLDivElement | null>(null);
    const dot3 = useRef<HTMLDivElement | null>(null);
    const tl = useRef<GSAPTimeline | null>(null);
    const dotStyle = {
        width: "clamp(1rem, 1vw, 5rem)",
        height: "clamp(1rem, 1vw, 5rem)",
    };
    const dotClassName = "rounded-[50%] " + dotColor
    useEffect(() => {
        tl.current = gsap.timeline({
            repeat: -1, 
            yoyo: true,
        });
        tl.current
        .to(dot1.current, {
            scale: 1.2,
        })
        .to(dot1.current, {
            scale: 1
        })
        .to(dot2.current, {
            scale: 1.2
        }, "<")
        .to(dot2.current, {
            scale: 1
        })
        .to(dot3.current, {
            scale: 1.2
        }, "<")
        .to(dot3.current, {
            scale: 1
        })
        return () => {
            if (tl.current) {
                tl.current.revert();
                tl.current = null;
            }
        }
    }, []);
    return (
        <div 
            className="flex gap-4 items-center justify-center"
            style={style}
        >
            <div ref={dot1} style={dotStyle} className={dotClassName}></div>
            <div ref={dot2} style={dotStyle} className={dotClassName}></div>
            <div ref={dot3} style={dotStyle} className={dotClassName}></div>
        </div>
    );
};

export default DotLoading;