import { useContext, useEffect, useRef, useState, type Ref, type RefObject } from "react";
import * as turf from "@turf/turf";
import mapboxgl from "mapbox-gl";
import type { SpotList } from "../features/SpotRender/SpotList";
import type { coordinate } from "../features/SpotRender/Spot";
import { LAYER_NAME, SOURCE_NAME } from "../pages/TravelDiaryPage";
import IsPlayContext from "../contexts/IsPlayContext";
import gsap from "gsap";
import { createPortal } from "react-dom";

const INITIAL_ZOOM = 10.12;

export type Trip = {
    start: coordinate,
    end: coordinate
}

const TravelMap = ({spotList}: {spotList: SpotList}) => {
    const trips = spotList.getTrips();
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);
    const markerContentRef = useRef(document.createElement("div"));
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const isPlayContext = useContext(IsPlayContext);
    const tl = useRef<GSAPTimeline | null>(null);
    
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
        if (isPlayContext && !isPlayContext.isPlay) {
            for (let i = 0; i < trips.length; i++) {
                const trip = trips[i];
                const origin = turf.point([trip.start.lng, trip.start.lat]);
                const destination = turf.point([trip.end.lng, trip.end.lat]);
                const arcLine = turf.greatCircle(origin, destination, {npoints: 1000});
                if (!mapRef.current?.getSource(`${SOURCE_NAME}-${i}`)) {
                    mapRef.current?.addSource(`${SOURCE_NAME}-${i}`, {
                        type: "geojson",
                        "data": arcLine
                    });
                    mapRef.current?.addLayer({
                        'id': `${LAYER_NAME}-${i}`,
                        'type': 'line',
                        'source': `${SOURCE_NAME}-${i}`,
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
            }
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
    }, [mapLoaded, spotList, isPlayContext]);

    useEffect(() => {
        if (!isPlayContext || !isPlayContext.isPlay || !mapLoaded || !mapRef.current) {
            return;
        }
        tl.current = gsap.timeline();
        const tripNum = trips.length;
        for (let i = tripNum - 1; i >= 0; i--) {
            if (mapRef.current.getLayer(`flight-arc-layer-${i}`)) {
                mapRef.current.removeLayer(`flight-arc-layer-${i}`);
            }
            if (mapRef.current.getSource(`flight-arc-${i}`)) {
                mapRef.current.removeSource(`flight-arc-${i}`);
            }
        }
        const camera = {
            zoom: mapRef.current.getZoom(),
            lng: trips[0].start.lng,
            lat: trips[0].start.lat
        };

        markerRef.current = new mapboxgl.Marker(markerContentRef.current)
                            .setLngLat([camera.lng, camera.lat])
                            .addTo(mapRef.current);
            
        for (let i = 0; i < tripNum; i++) {
            const trip = trips[i];
            const origin = turf.point([trip.start.lng, trip.start.lat]);
            const destination = turf.point([trip.end.lng, trip.end.lat]);
            const arcLine = turf.greatCircle(origin, destination, { npoints: 1000 });
            const segments: GeoJSON.Feature<GeoJSON.LineString>[] =
                arcLine.geometry.type === "MultiLineString"
                    ? arcLine.geometry.coordinates.map((coords) => turf.lineString(coords))
                    : [turf.lineString(arcLine.geometry.coordinates as [number, number][])];

            const segmentLengths = segments.map((seg) => turf.length(seg));
            const totalLength = segmentLengths.reduce((a, b) => a + b, 0);

            const animatedLine: GeoJSON.Feature<GeoJSON.MultiLineString> = {
                type: "Feature",
                properties: {},
                geometry: { type: "MultiLineString", coordinates: segments.map(() => []) }
            };

            mapRef.current?.addSource(`${SOURCE_NAME}-${i}`, { type: "geojson", data: animatedLine });
            mapRef.current?.addLayer({
                id: `${LAYER_NAME}-${i}`,
                type: "line",
                source: `${SOURCE_NAME}-${i}`,
                layout: { "line-cap": "round", "line-join": "round" },
                paint: { "line-color": "#3887be", "line-width": 5 }
            });
            const velocity = 500;
            const duration = totalLength/velocity;
            const progress = { t: 0 };
            tl.current.to(progress, {
                t: 1,
                duration: duration,
                onUpdate: () => {
                    let remaining = totalLength * progress.t;
                    let lastCoord: [number, number] | null = null;
                    animatedLine.geometry.coordinates = segments.map((seg, idx) => {
                        const segLen = segmentLengths[idx];
                        const drawn = Math.max(0, Math.min(remaining, segLen));
                        remaining -= segLen;
                        if (drawn <= 0)
                            return [];
                        const sliceCoords = turf.lineSliceAlong(seg, 0, drawn).geometry.coordinates as [number, number][];
                        lastCoord = sliceCoords[sliceCoords.length - 1];
                        return sliceCoords;
                    });
                    const source = mapRef.current?.getSource(`${SOURCE_NAME}-${i}`) as mapboxgl.GeoJSONSource;
                    source?.setData(animatedLine);

                    if (lastCoord) {
                        mapRef.current?.jumpTo({
                            center: lastCoord,
                        })
                    }
                }
            });
        }

        tl.current.to({}, {
            onComplete: () => {
                isPlayContext.handlePlayChange(false);
            }
        })
        

        return () => {
            if (tl.current) {
                tl.current.kill();
                tl.current = null;
            }
        }

    }, [isPlayContext]);

    return (
        <>
            <div id="map-container" ref={mapContainerRef} className="w-full h-full">
            </div>
            {
                createPortal(<div className="bg-blue-500 w-[50px] h-[50px] rounded-[50%]"></div>, markerContentRef.current)
            }
        </>
    );
};

export default TravelMap;