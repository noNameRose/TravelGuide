import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

const INITIAL_CENTER = [
    -74.0242,
    40.6941
];

const INITIAL_ZOOM = 10.12;

const Map = () => {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER as [number, number]);
    const [zoom, setZoom] = useState<number>(INITIAL_ZOOM);

    useEffect(() => {
        mapRef.current = new mapboxgl.Map({
            accessToken: import.meta.env.VITE_MAPBOX_API,
            container: mapContainerRef.current as HTMLDivElement,
            center: center,
            zoom: zoom
        });

        return () => {
            mapRef.current?.remove();
        }
    }, []);
    
    return (
        <>
            <div id="map-container" ref={mapContainerRef} className="w-[50vw] min-h-screen"></div>
        </>
    );
};

export default Map;