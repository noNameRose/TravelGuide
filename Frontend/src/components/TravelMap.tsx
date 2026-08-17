import { useEffect, useRef, useState } from "react";
import * as turf from "@turf/turf";
import mapboxgl from "mapbox-gl";
import type { SpotList } from "../features/SpotRender/SpotList";
import type { coordinate } from "../features/SpotRender/Spot";

const INITIAL_ZOOM = 10.12;

export type Trip = {
    start: coordinate,
    end: coordinate
}

const TravelMap = ({trips}: {trips: Trip[]}) => {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);

    useEffect(() => {
        mapRef.current = new mapboxgl.Map({
            accessToken: import.meta.env.VITE_MAPBOX_API,
            container: mapContainerRef.current as HTMLDivElement,
            zoom: INITIAL_ZOOM
        });

        const origin = turf.point([-122.414, 37.776]); 
        const destination = turf.point([-77.032, 38.913]);
        const arcLine = turf.greatCircle(origin, destination, {npoints: 100});

        mapRef.current.on("load", () => {
            setMapLoaded(true);
        });

        return () => {
            mapRef.current?.remove();
        };
    }, []);

    return (
        <div id="map-container" ref={mapContainerRef} className="w-full h-full">
            
        </div>
    );
};

export default TravelMap;