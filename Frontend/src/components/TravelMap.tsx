import { useContext, useEffect, useRef, useState, type Ref, type RefObject } from "react";
import * as turf from "@turf/turf";
import mapboxgl from "mapbox-gl";
import type { SpotList } from "../features/SpotRender/SpotList";
import type { coordinate } from "../features/SpotRender/Spot";
import { LAYER_NAME, SOURCE_NAME } from "../pages/TravelDiaryPage";
import IsPlayContext from "../contexts/IsPlayContext";

const INITIAL_ZOOM = 10.12;

export type Trip = {
    start: coordinate,
    end: coordinate
}

const TravelMap = ({spotList, mapRef}: {spotList: SpotList, mapRef: RefObject<mapboxgl.Map | null>}) => {
    const trips = spotList.getTrips();
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const isPlay = useContext(IsPlayContext);
    
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
        const tripNum = trips.length;
        if (isPlay) {
            for (let i = tripNum - 1; i >= 0; i--) {
                if (mapRef.current?.getLayer(`flight-arc-layer-${i}`)) {
                    mapRef.current.removeLayer(`flight-arc-layer-${i}`);
                }
                if (mapRef.current?.getSource(`flight-arc-${i}`)) {
                    mapRef.current.removeSource(`flight-arc-${i}`);
                }
            }
            return;
        }
        let count = 0;
        for (const trip of trips) {
            const origin = turf.point([trip.start.lng, trip.start.lat]);
            const destination = turf.point([trip.end.lng, trip.end.lat]);
            const arcLine = turf.greatCircle(origin, destination, {npoints: 1000});
            if (!mapRef.current?.getSource(`${SOURCE_NAME}-${count}`)) {
                mapRef.current?.addSource(`${SOURCE_NAME}-${count}`, {
                    type: "geojson",
                    "data": arcLine
                });
                mapRef.current?.addLayer({
                    'id': `${LAYER_NAME}-${count}`,
                    'type': 'line',
                    'source': `${SOURCE_NAME}-${count}`,
                    'layout': {
                        'line-cap': 'round',
                        'line-join': 'round'
                    },
                    'paint': {
                        'line-color': '#3887be',
                        'line-width': 5,
                    }
                });
            }
            count++;
        }

        return () => {
            // if (!mapRef.current)
            //     return;
            // for (let i = count; i >= 0; i--) {
            //     if (mapRef.current.getLayer(`flight-arc-layer-${i}`)) {
            //         mapRef.current.removeLayer(`flight-arc-layer-${i}`);
            //     }
            //     if (mapRef.current.getSource(`flight-arc-${i}`)) {
            //         mapRef.current.removeSource(`flight-arc-${i}`);
            //     }
            // }
        }
    }, [mapLoaded, spotList, isPlay]);

    return (
        <div id="map-container" ref={mapContainerRef} className="w-full h-full">
            
        </div>
    );
};

export default TravelMap;