import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type MarkerProp = {
    map: mapboxgl.Map,
    location: [number, number],
    imgName: string
};

const Marker = ({map, location, imgName}: MarkerProp) => {
    const contentRef = useRef(document.createElement("div"));
    const markerRef = useRef<mapboxgl.Marker | null>(null);
    const imgURL = import.meta.env.VITE_PLACE_PICTURE_API_URL + imgName + `/media?key=${import.meta.env.VITE_PLACE_API_KEY}&maxHeightPx=${300}&maxWidthPx=${300}`;
    useEffect(() => {
        markerRef.current = new mapboxgl.Marker(contentRef.current)
            .setLngLat(location)
            .addTo(map);

        return () => {
            markerRef.current?.remove();
        };
    }, []);
    return (
        <>
            {createPortal(
                <div
                    className="bg-cover bg-no-repeat cursor-pointer bg-center transition w-[60px] h-[60px] rounded-[50%] bg-red-400"
                    style={
                        {
                            backgroundImage: `url(${imgURL})`
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