import { useEffect, useMemo, useRef, useState } from "react";
import TravelMap from "../components/TravelMap";
import { Spot, type Transportation } from "../features/SpotRender/Spot";
import { SpotList } from "../features/SpotRender/SpotList";
import DiaryList from "../components/DiaryList";
import searchCoordinate, { type GeoCodingResBody } from "../utils/searchCoordinate";
import IsPlayContext from "../contexts/IsPlayContext";
import gsap from "gsap";


const INITIAL_LIST = new SpotList();

INITIAL_LIST.addSpot(Spot.builder()
                        .name("Minneapolis")
                        .location({
                            lng: -93.26384,
                            lat: 44.97997
                        })
                        .build()
);
INITIAL_LIST.addSpot(Spot.builder()
                        .name("Chicago")
                        .location({
                            lng: -87.6298,
                            lat: 41.8781
                        })
                        .getHereBy("flight")
                        .build()
);
INITIAL_LIST.addSpot(Spot.builder()
                        .name("Las Vegas")
                        .location({
                            lng: -115.137,
                            lat: 36.175
                        })
                        .getHereBy("flight")
                        .build()
);
INITIAL_LIST.addSpot(Spot.builder()
                        .name("Incline Village")
                        .location({
                            lng: -119.9730,
                            lat: 39.2513
                        })
                        .getHereBy("flight")
                        .build()
);
INITIAL_LIST.addSpot(Spot.builder()
                        .name("Hanoi")
                        .location({
                            lng: 105.8048,
                            lat: 21.0285
                        })
                        .getHereBy("flight")
                        .build()
);

export const SOURCE_NAME = "flight-arc";
export const LAYER_NAME = "flight-arc-layer";



const TravelDiaryPage = () => {
    const [spotList, setSpotList] = useState<SpotList>(INITIAL_LIST);
    const [showInput, setShowInput] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const [transQuery, setTransQuery] = useState<string>("");
    const [isPlay, setIsPlay] = useState<boolean>(false);
    const plusButton = useRef<HTMLButtonElement | null>(null);
    const [isPlusButtonHover, setPlusButtonHover] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);

    const contextValue = useMemo(() => {
        return {
            isPlay: isPlay,
            handlePlayChange: setIsPlay
        }
    }, [isPlay]);

    const validTransportation = ["flight", "driving", "cycling", "walking"];
    const isInputValid = (validTransportation.includes(transQuery)) && (query !== "");

    useEffect(() => {
        if (isPlusButtonHover) {
            gsap.to(plusButton.current, {
                scale: 1.2,
                ease: "power4.out"
            });
        }
        else {
            gsap.to(plusButton.current, {
                scale: 1,
                ease: "power4.out"
            });
        }
        
        if (isMouseDown) {
            gsap.to(plusButton.current, {
                scale: 1,
                ease: "power4.out"
            });
        }
    }, [isPlusButtonHover, isMouseDown]);
    
    return (
        <IsPlayContext
            value={contextValue}
        >
            <div className="flex py-[1em] items-center justify-center pr-[1em]">
                <div className="w-[22vw] h-screen flex flex-col gap-6 overflow-scroll items-center">
                    <button className="w-[3rem] cursor-pointer"
                        ref={plusButton}
                        onMouseOver={() => setPlusButtonHover(true)}
                        onMouseOut={() => setPlusButtonHover(false)}
                        onMouseDown={() => setIsMouseDown(true)}
                        onMouseUp={() => setIsMouseDown(false)}
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 640 640"
                            className="w-full h-full"
                        >
                            <path className="fill-blue_400" d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM296 408L296 344L232 344C218.7 344 208 333.3 208 320C208 306.7 218.7 296 232 296L296 296L296 232C296 218.7 306.7 208 320 208C333.3 208 344 218.7 344 232L344 296L408 296C421.3 296 432 306.7 432 320C432 333.3 421.3 344 408 344L344 344L344 408C344 421.3 333.3 432 320 432C306.7 432 296 421.3 296 408z"/>
                        </svg>
                    </button>
                    <DiaryList
                        spotList={spotList}
                    />
                </div>
                <div className="w-[70vw] h-screen">
                    <TravelMap
                        spotList={spotList}
                    />
                </div>
            </div>
         </IsPlayContext>
    );
};

export default TravelDiaryPage;