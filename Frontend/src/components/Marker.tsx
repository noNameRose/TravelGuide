import mapboxgl from "mapbox-gl";
import { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import SelectedPlaceContext from "../contexts/SelectedPlaceContext";
import gsap from "gsap";
import type { Place } from "./SearchTab";

type MarkerProp = {
    map: mapboxgl.Map,
    location: [number, number],
    imgName: string,
    place: Place
};

const Marker = ({map, location, imgName, place}: MarkerProp) => {
    const contentRef = useRef(document.createElement("div"));
    const markerRef = useRef<mapboxgl.Marker | null>(null);
    const imgURL = import.meta.env.VITE_PLACE_PICTURE_API_URL + imgName + `/media?key=${import.meta.env.VITE_PLACE_API_KEY}&maxHeightPx=${300}&maxWidthPx=${300}`;
    const [isHover, setIsHover] = useState<boolean>(false);
    const domRef = useRef<HTMLDivElement | null>(null);
    const selectedPlaceContext = useContext(SelectedPlaceContext);

    useEffect(() => {
        markerRef.current = new mapboxgl.Marker(contentRef.current)
            .setLngLat(location)
            .addTo(map);

        return () => {
            markerRef.current?.remove();
        };
    }, []);

    useEffect(() => {
        if (isHover) {
            gsap.to(domRef.current, {
                transform: "scale(1.2)",
                ease: "back.out"
            })
        }
        else {
            gsap.to(domRef.current, {
                transform: "scale(1)",
                ease: "back.out"
            })
        }
    }, [isHover]);
    return (
        <>
            {createPortal(
                <div
                    onMouseOver={() => setIsHover(true)}
                    onMouseOut={() => setIsHover(false)}
                    onClick={() => selectedPlaceContext?.setSelectedPlaced(place)}
                    ref={domRef}
                    className="bg-cover bg-no-repeat cursor-pointer bg-center w-[60px] h-[60px] rounded-[50%] bg-red-400 border-3 border-white"
                    style={
                        {
                            backgroundImage: `url(${imgURL})`,
                        }
                    }
                >
                </div>
            , contentRef.current
            )}
        </>
    );
};

export default Marker;