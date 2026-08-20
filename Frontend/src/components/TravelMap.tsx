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
};

type RouteResBody = {
    routes: {
        geometry: {
            coordinates: [number, number][],
        },
        distance: number
    }[]
};

const TravelMap = ({spotList}: {spotList: SpotList}) => {
    const trips = spotList.getTrips();
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);
    const plane = useRef<SVGSVGElement | null>(null);
    const markerContentRef = useRef(document.createElement("div"));
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const isPlayContext = useContext(IsPlayContext);
    const routeMap = useRef<Map<string, {distance: number, route: [number, number][]}>>(new Map<string, {distance: number, route: [number, number][]}>());
    const tl = useRef<GSAPTimeline | null>(null);
    
    useEffect(() => {
        mapRef.current = new mapboxgl.Map({
            accessToken: import.meta.env.VITE_MAPBOX_API,
            container: mapContainerRef.current as HTMLDivElement,
            zoom: INITIAL_ZOOM,
            center: [105.8048, 21.0285],
            projection: "globe",
            style: import.meta.env.VITE_MAP_STYLE
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
                const transportation = trip.transportation;
                const startLng = trip.start.lng;
                const startLat = trip.start.lat;
                const endLng = trip.end.lng;
                const endLat = trip.end.lat;
                if (transportation && transportation === "flight") {
                    const origin = turf.point([startLng, startLat]);
                    const destination = turf.point([endLng, endLat]);
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
                if (transportation && transportation === "driving") {
                    if (!mapRef.current?.getSource(`driving-${i}`)) {
                        fetch(import.meta.env.VITE_DIRECTION_API + `driving/${startLng},${startLat};${endLng},${endLat}?annotations=maxspeed&overview=full&geometries=geojson&access_token=${import.meta.env.VITE_MAPBOX_API}`)
                        .then(response => response.json())
                        .then((body: RouteResBody)=> {
                            routeMap.current.set(`driving-${i}`, {
                                distance: body.routes[0].distance,
                                route: body.routes[0].geometry.coordinates
                            });
                            mapRef.current?.addSource(`driving-${i}`, {
                                type: "geojson",
                                "data": {
                                    type: "Feature",
                                    properties: {},
                                    geometry: {
                                        type: "LineString",
                                        coordinates: body.routes[0].geometry.coordinates
                                    }
                                }
                            });
                            mapRef.current?.addLayer({
                                'id': `driving-${i}`,
                                'type': 'line',
                                'source': `driving-${i}`,
                                'layout': {
                                    'line-cap': 'round',
                                    'line-join': 'round'
                                },
                                'paint': {
                                    'line-color': '#3887be',
                                    'line-width': 5,
                                }
                            });
                        })
                    }
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
            if (mapRef.current.getLayer(`driving-${i}`)) {
                mapRef.current.removeLayer(`driving-${i}`);
            }
            if (mapRef.current.getSource(`driving-${i}`)) {
                mapRef.current.removeSource(`driving-${i}`);
            }
        }
        const camera = {
            zoom: mapRef.current.getZoom(),
            lng: trips[0].start.lng,
            lat: trips[0].start.lat
        };
        

        markerRef.current = new mapboxgl.Marker(markerContentRef.current, {
            rotation: 0,
            rotationAlignment: "map"
        })
        .setLngLat([camera.lng, camera.lat])
        .addTo(mapRef.current);

        const currentCamera = {
            zoom: mapRef.current.getZoom(), 
            lng: mapRef.current.getCenter().lng,
            lat: mapRef.current.getCenter().lat,
        };

        tl.current.to(currentCamera, {
            zoom: mapRef.current.getZoom(),
            lng: trips[0].start.lng,
            lat: trips[0].start.lat,
            duration: 2,
            onUpdate: () => {
                mapRef.current?.jumpTo({
                    center: [currentCamera.lng, currentCamera.lat]}
                )
            }
        });

    
        for (let i = 0; i < tripNum; i++) {
            const trip = trips[i];
            const origin = turf.point([trip.start.lng, trip.start.lat]);
            const destination = turf.point([trip.end.lng, trip.end.lat]);
            const transportation = trip.transportation;
            tl.current.to({}, {
                onUpdate: () => {
                    const bearing = turf.bearing(origin, destination);
                    markerRef.current?.setRotation(bearing);
                }
            });

            if (transportation === "flight") {
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

                const velocity = 1000;
                const duration = totalLength/velocity;
                const progress = { t: 0 };

                tl.current
                .to(plane.current, {
                    transform: "scale(1)"
                })
                .to(progress, {
                    t: 1,
                    duration: duration,
                    onUpdate: () => {
                        let remaining = totalLength * progress.t;
                        let lastCoord: [number, number] | null = null;
                        let coords: [number, number][] = [];
                        animatedLine.geometry.coordinates = segments.map((seg, idx) => {
                            const segLen = segmentLengths[idx];
                            const drawn = Math.max(0, Math.min(remaining, segLen));
                            remaining -= segLen;
                            if (drawn <= 0)
                                return [];
                            const sliceCoords = turf.lineSliceAlong(seg, 0, drawn).geometry.coordinates as [number, number][];
                            coords = sliceCoords;
                            lastCoord = sliceCoords[sliceCoords.length - 1];
                            return sliceCoords;
                        });
                        const source = mapRef.current?.getSource(`${SOURCE_NAME}-${i}`) as mapboxgl.GeoJSONSource;
                        source?.setData(animatedLine);

                        if (lastCoord) {
                            mapRef.current?.jumpTo({
                                center: lastCoord,
                            });
                        }

                        if (coords.length >= 2) {
                            const bearingAngle = turf.bearing(
                                turf.point(coords[coords.length - 2]),
                                turf.point(coords[coords.length - 1])
                            );
                            if (lastCoord) {
                                markerRef.current?.setLngLat(lastCoord).setRotation(bearingAngle);
                            }
                        }
                    }
                })
                .to(plane.current, {
                    transform: "scale(0)"
                }, "-=0.5");
            }
            else if (transportation === "driving") {
                const animatedLine: GeoJSON.Feature<GeoJSON.LineString> = {
                    type: "Feature",
                    properties: {},
                    geometry: { 
                        type: "LineString", 
                        coordinates: []
                    }
                };

                mapRef.current?.addSource(`driving-${i}`, { type: "geojson", data: animatedLine });
                mapRef.current?.addLayer({
                    id: `driving-${i}`,
                    type: "line",
                    source: `driving-${i}`,
                    layout: { "line-cap": "round", "line-join": "round" },
                    paint: { "line-color": "#3887be", "line-width": 5 }
                });

                const totalLength = (routeMap.current.get(`driving-${i}`)?.distance as number)/1000;
                const routes = routeMap.current.get(`driving-${i}`)?.route;
                const velocity = 500;
                const duration = (totalLength as number)/velocity;
                const progress = { t: 0 };

                tl.current
                .to(plane.current, {
                    transform: "scale(1)"
                })
                .to(progress, {
                    t: 1,
                    duration: duration,
                    onUpdate: () => {
                        animatedLine.geometry.coordinates = (routes as [number, number][]).slice(0, progress.t * (routes?.length as number) + 1) ;
                        const source = mapRef.current?.getSource(`driving-${i}`) as mapboxgl.GeoJSONSource;
                        source?.setData(animatedLine);

                        // if (lastCoord) {
                        //     mapRef.current?.jumpTo({
                        //         center: lastCoord,
                        //     });
                        // }

                        // if (coords.length >= 2) {
                        //     const bearingAngle = turf.bearing(
                        //         turf.point(coords[coords.length - 2]),
                        //         turf.point(coords[coords.length - 1])
                        //     );
                        //     if (lastCoord) {
                        //         markerRef.current?.setLngLat(lastCoord).setRotation(bearingAngle);
                        //     }
                        // }
                    }
                })
                // .to(plane.current, {
                //     transform: "scale(0)"
                // }, "-=0.5");
            }
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
                createPortal(
                    <div 
                        className="w-[30px] h-[30px]"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            ref={plane}
                            viewBox="0 0 24 24" 
                            className="transform scale-0"
                            fill="currentColor">
                            <path d="M14 8.94737L22 14V16L14 13.4737V18.8333L17 20.5V22L12.5 21L8 22V20.5L11 18.8333V13.4737L3 16V14L11 8.94737V3.5C11 2.67157 11.6716 2 12.5 2C13.3284 2 14 2.67157 14 3.5V8.94737Z">
                            </path>
                        </svg>
                    </div>, 
                    
                    markerContentRef.current)
            }
        </>
    );
};

export default TravelMap;