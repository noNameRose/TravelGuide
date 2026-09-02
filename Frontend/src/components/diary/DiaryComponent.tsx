import type { Diary } from "../../utils/getDiaries";
import diaryImage from "../../assets/mapimage.png";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

type DiaryComponentType = {
    diary: Diary
}

const DiaryComponent = ({diary}: DiaryComponentType) => {
    const container = useRef<HTMLDivElement | null>(null);
    const name = useRef<HTMLParagraphElement | null>(null);
    const [isHover, setIsHover] = useState(false);
    const tl = useRef<GSAPTimeline | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        tl.current = gsap.timeline({defaults: {ease: "power4"}});
        if (isHover) {
            tl.current
            .to(container.current, {
                backgroundColor: "#64BECE"
            })
            .to(name.current, {
                color:  "#ECF7F9"
            }, "<")

        }
        else {
            tl.current
            .to(container.current, {
                backgroundColor: "#ECF7F9"
            })
            .to(name.current, {
                color: "#64BECE"
            }, "<")
            
        }
    }, [isHover]);
    
    return (
        <div 
            className="flex gap-4 p-[.5em] rounded-[1.5em] cursor-pointer"
            ref={container}
            onMouseOver={() => setIsHover(true)}
            onMouseOut={() => setIsHover(false)}
            onClick={() => navigate(`/diary/edit?id=${diary.diaryId}`)}
        >
            <div
                className="rounded-[1em]"
                style={
                    {
                        width: "15rem",
                        height: "10rem",
                        backgroundImage: `url(${diaryImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                        
                    }
                }
            ></div>
            <div>
                <p 
                    className="font-bold text-[1.5rem] text-blue_400"
                    ref={name}
                >{diary.name}</p>
            </div>
        </div>
    );
};

export default DiaryComponent;