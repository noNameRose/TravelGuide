import gsap from "gsap";
import { Draggable } from "gsap/all";
import { useEffect, useRef } from "react";

gsap.registerPlugin(Draggable);

const RangeController = ({handleChangeRange}: {handleChangeRange: (func: (range: number) => number) => void}) => {
    const circle = useRef<HTMLDivElement | null>(null);
    const bar = useRef<HTMLDivElement | null>(null);
    const draggle = useRef<GSAPDraggableVars | null>(null);
    const lastX = useRef<number>(0);

    useEffect(() => {
        if (circle.current)
            lastX.current = circle.current.getBoundingClientRect().x;
        draggle.current = Draggable.create(circle.current, {
            bounds: bar.current,
            type: "x",
            onDrag: () => {
                const currentX = circle.current?.getBoundingClientRect().x;
                if (currentX && currentX > lastX.current) {
                    handleChangeRange((lastVal: number) => lastVal + 1);
                    lastX.current = currentX;
                }
                else if (currentX && currentX < lastX.current) {
                    handleChangeRange((lastVal: number) => lastVal - 1);
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