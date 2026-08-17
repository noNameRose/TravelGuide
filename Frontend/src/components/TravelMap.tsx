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

        mapRef.current.on("load", () => {
            setMapLoaded(true);
        });

        return () => {
            mapRef.current?.remove();
        };
    }, []);

    useEffect(() => {
        if (!mapLoaded) {
            return;
        }

        let count = 0;
        for (const trip of trips) {
            const origin = turf.point([trip.start.lng, trip.start.lat]);
            const destination = turf.point([trip.end.lng, trip.end.lat]);
            const arcLine = turf.greatCircle(origin, destination, {npoints: 1000});
            mapRef.current?.addSource(`flight-arc-${count}`, {
                type: "geojson",
                "data": arcLine
            });
            mapRef.current?.addLayer({
                'id': `flight-arc-layer-${count}`,
                'type': 'line',
                'source': `flight-arc-${count}`,
                'layout': {
                    'line-cap': 'round',
                    'line-join': 'round'
                },
                'paint': {
                    'line-color': '#3887be',
                    'line-width': 5,
                }
            });
            count++;
        }
    }, [mapLoaded]);

    return (
        <div id="map-container" ref={mapContainerRef} className="w-full h-full">
            
        </div>
    );
};

export default TravelMap;