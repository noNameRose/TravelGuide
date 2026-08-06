import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
const Map = () => {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        mapRef.current = new mapboxgl.Map({
            accessToken: import.meta.env.VITE_MAPBOX_API,
            container: mapContainerRef.current as HTMLDivElement
        });

        return () => {
            mapRef.current?.remove();
        }
    }, []);
    
    return (
        <>
            <div id="map-container" ref={mapContainerRef} className="w-[50vw] h-screen"></div>
        </>
    );
};

export default Map;