import gsap from "gsap";
import { Draggable } from "gsap/all";
import { useContext, useEffect, useRef } from "react";
import SearchRadiusContext from "../contexts/SearchRadiusContext";

gsap.registerPlugin(Draggable);

const CHANGE_AMOUNT = 0.3;

const RangeController = () => {
    const circle = useRef<HTMLDivElement | null>(null);
    const bar = useRef<HTMLDivElement | null>(null);
    const searchRadiusContext = useContext(SearchRadiusContext);
    const draggle = useRef<GSAPDraggableVars | null>(null);
    const lastX = useRef<number>(0);

    useEffect(() => {
        if (circle.current)
            lastX.current = gsap.getProperty(circle.current, "x") as number;
        draggle.current = Draggable.create(circle.current, {
            bounds: bar.current,
            type: "x",
            onDrag: () => {
                if (!circle.current)
                    return;
                if (!searchRadiusContext) {
                    return;
                }
                const currentX = gsap.getProperty(circle.current, "x") as number;
                const newRad = ((currentX/((gsap.getProperty(bar.current, "width") as number))) * (searchRadiusContext.maxRadius - searchRadiusContext.minRadius)) + searchRadiusContext.minRadius;
                if (currentX && currentX > lastX.current) {
                    searchRadiusContext.handleRadiusChange((lastRad: number) => newRad);
                    lastX.current = currentX;
                }
                else if (currentX && currentX < lastX.current) {
                    searchRadiusContext.handleRadiusChange((lastVal: number) => newRad);
                    lastX.current = currentX;
                }
            }
        });

        return () => {
        }
    }, []);

    return (
        <div className="w-[80%] absolute z-100000 left-1/2 -translate-x-1/2 bg-gray-400 p-2 rounded-2xl bottom-12">
            <div 
                className="w-full h-[5px] rounded-2xl bg-amber-50"
                ref={bar}
            >
                <div 
                    className="w-[2rem] h-[2rem] rounded-[50%] bg-gray-500 absolute left-0 top-1/2 -translate-y-1/2"
                    ref={circle}
                ></div>
            </div>
        </div>
    );
};

export default RangeController;