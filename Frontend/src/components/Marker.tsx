import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type MarkerProp = {
    map: mapboxgl.Map
};

const Marker = ({map}: MarkerProp) => {
    const contentRef = useRef(document.createElement("div"));
    const markerRef = useRef<mapboxgl.Marker | null>(null);

    useEffect(() => {
        markerRef.current = new mapboxgl.Marker(contentRef.current)
            .setLngLat([0, 0])
            .addTo(map);

        return () => {
            markerRef.current?.remove();
        };
    }, []);
    return (
        <>
            {createPortal(
                <div
                    className=""
                    style={
                        {
                            backgroundImage: ""
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