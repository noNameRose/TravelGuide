import { useContext, useEffect, useRef, useState, type Ref, type RefObject } from "react";
import * as turf from "@turf/turf";
import mapboxgl from "mapbox-gl";
import type { SpotList } from "../features/SpotRender/SpotList";
import type { coordinate } from "../features/SpotRender/Spot";
import { LAYER_NAME, SOURCE_NAME } from "../pages/EditDiaryPage";
import IsPlayContext from "../contexts/IsPlayContext";
import gsap from "gsap";
import { createPortal } from "react-dom";

const INITIAL_ZOOM = 10.12;

const DRIVING_ROUTE_ZOOM = 5;
const FLYING_ROUTE_ZOOM = 3;

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
    
    const carMakerRef = useRef<mapboxgl.Marker | null>(null);
    const carMarkerContentRef = useRef(document.createElement("div"));
    const car = useRef<SVGSVGElement | null>(null);
    
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

        carMakerRef.current = new mapboxgl.Marker(carMarkerContentRef.current, {
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
            zoom: trips[0].transportation === "flight" ? FLYING_ROUTE_ZOOM : DRIVING_ROUTE_ZOOM,
            lng: trips[0].start.lng,
            lat: trips[0].start.lat,
            duration: 2,
            onUpdate: () => {
                mapRef.current?.jumpTo({
                    center: [currentCamera.lng, currentCamera.lat],
                    zoom: currentCamera.zoom
                });
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
                    if (transportation === "flight") {
                        markerRef.current?.setLngLat([trip.start.lng, trip.start.lat]).setRotation(bearing);
                    }
                    else if (transportation === "driving") {
                        carMakerRef.current?.setLngLat([trip.start.lng, trip.start.lat]).setRotation(bearing);
                    }
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
                const zoomProgress = {t: 0};
                tl.current
                .to(plane.current, {
                    transform: "scale(1)"
                })
                if (i > 0 && trips[i - 1].transportation !== "flight") {
                    tl.current.to(zoomProgress, {
                        t: 1,
                        onUpdate: () => {
                            const remaining = zoomProgress.t;
                            const newZoom = remaining * -(DRIVING_ROUTE_ZOOM - FLYING_ROUTE_ZOOM) + DRIVING_ROUTE_ZOOM;
                            mapRef.current?.jumpTo({
                                zoom: newZoom
                            });
                        }
                    });
                }
                tl.current.to(progress, {
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
                                center: lastCoord
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

                const routLine = turf.lineString(routes?.map(route => [route[0], route[1]]) as [number, number][]);


                const velocity = 100;
                const duration = (totalLength as number)/velocity;
                const progress = { t: 0 };
                const zoomProgress = { t: 0 };
                tl.current
                .to(car.current, {
                    transform: "scale(1)"
                });
                if (i > 0 && trips[i - 1].transportation !== "driving") {
                    tl.current.to(zoomProgress, {
                        t: 1,
                        duration: 2,
                        onUpdate: () => {
                            const remaining = zoomProgress.t;
                            const newZoom = remaining * (DRIVING_ROUTE_ZOOM - FLYING_ROUTE_ZOOM)  + FLYING_ROUTE_ZOOM;
                            mapRef.current?.jumpTo({
                                zoom: newZoom
                            });
                        }
                    });
                }
                tl.current.to(progress, {
                    t: 1,
                    duration: duration,
                    onUpdate: () => {

                        const drawn = Math.max(0, Math.min(totalLength, totalLength * progress.t));
                        const sliced = drawn > 0 ? 
                                (turf.lineSliceAlong(routLine, 0, drawn)).geometry.coordinates as [number, number][] : 
                                []
                        ;

                        animatedLine.geometry.coordinates = sliced;
                        const source = mapRef.current?.getSource(`driving-${i}`) as mapboxgl.GeoJSONSource;
                        source?.setData(animatedLine);
                        
                        const currentCoordLen = animatedLine.geometry.coordinates.length;
                        if (currentCoordLen > 0) {
                            mapRef.current?.jumpTo({
                                center: animatedLine.geometry.coordinates[currentCoordLen - 1] as [number, number]
                            });
                        }

                        if (currentCoordLen >= 2) {
                            const bearingAngle = turf.bearing(
                                turf.point(animatedLine.geometry.coordinates[currentCoordLen - 2]),
                                turf.point(animatedLine.geometry.coordinates[currentCoordLen - 1])
                            );
                            carMakerRef.current?.setLngLat(animatedLine.geometry.coordinates[currentCoordLen - 1] as [number, number]).setRotation(bearingAngle);
                            
                        }
                    }
                })
                .to(car.current, {
                    transform: "scale(0)"
                }, "-=0.5");
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
            <div 
                id="map-container" 
                ref={mapContainerRef} 
                className="w-full h-full rounded-[1em] relative"
            >   
                <button 
                    className=" absolute 
                                top-[1rem]
                                left-[1rem]
                                z-10 
                                cursor-pointer 
                                py-[.5em]
                                px-[2em] 
                                text-[1rem] 
                                font-bold
                                bg-blue_400
                                text-blue_50
                                rounded-[.5em]
                                flex
                                gap-4
                                items-center
                                cursor-pointer
                            "
                    onClick={() => isPlayContext?.handlePlayChange(true)}
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 640 640"
                        className="w-[2rem]"
                    >
                        <path 
                            fill="#ecf7f9" 
                            d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"/>
                    </svg>
                </button>
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
            {
                createPortal(
                    <div 
                        className="w-[60px] h-[60px]"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="transform scale-0"
                            viewBox="0 0 100 125"
                            ref={car}
                        >
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M42.1000977,19.0244141l0.2431641,2.0410156l-3.9707031,1.7597656  l0.6181641-1.7792969l2.7900391-0.9355469l-0.1113281-0.9550781l-3.0332031,0.9169922l-2.1357422,4.1376953l-0.0380859,13.4082031  c-2.9755859,0.6367188-4.7353516,0.8046875-4.1748047,2.8085938l4.1572266-0.9179688l-0.1123047,38.1992188l1.1054688,3.2578125  l1.5351563,0.7119141c7.7705078,0.1123047,14.3442383,0.1123047,22.1333008,0l1.5361328-0.7119141l1.1035156-3.2578125  l-0.1298828-38.1796875l4.0996094,0.8984375c0.5429688-1.984375-1.1601563-2.171875-4.0996094-2.7900391l-0.0390625-13.4267578  l-2.1533203-4.1376953l-3.0332031-0.9169922l-0.0927734,0.9550781l2.7705078,0.9355469l0.6181641,1.7792969l-3.9511719-1.7597656  l0.2441406-2.0410156C47.9233398,17.9755859,52.1376953,17.9755859,42.1000977,19.0244141L42.1000977,19.0244141z   M43.3549805,75.3857422L39.1782227,74.375l2.6220703-6.6845703c5.5058594,0.0185547,10.9741211,0.0185547,16.4780273,0  L60.9003906,74.375l-4.1767578,1.0107422C51.5556641,75.2353516,48.503418,75.2353516,43.3549805,75.3857422L43.3549805,75.3857422z   M40.5454102,46.25l-2.0595703-6.3486328c3.6337891-1.5722656,5.7675781-2.8642578,9.90625-2.6386719H51.6875  c4.1386719-0.2255859,6.2734375,1.0664063,9.9052734,2.6386719L59.5332031,46.25  C57.2109375,45.1455078,42.8676758,45.1455078,40.5454102,46.25L40.5454102,46.25z M61.8369141,43.5351563l-1.5732422,4.0439453  L59.8525391,64.75l1.984375-1.0478516V43.5351563z M38.2241211,43.5351563l1.5712891,4.0439453L40.2084961,64.75  l-1.9658203-1.0478516L38.2241211,43.5351563z"/>
                        </svg>
                    </div>, 
                    
                    carMarkerContentRef.current)
            }
        </>
    );
};

export default TravelMap;