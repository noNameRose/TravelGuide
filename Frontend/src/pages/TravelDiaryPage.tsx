import { useEffect, useRef, useState } from "react";
import TravelMap from "../components/TravelMap";
import { Spot } from "../features/SpotRender/Spot";
import { SpotList } from "../features/SpotRender/SpotList";
import DiaryList from "../components/DiaryList";
import searchCoordinate, { type GeoCodingResBody } from "../utils/searchCoordinate";
import gsap from "gsap";
import IsPlayContext from "../contexts/IsPlayContext";
import * as turf from "@turf/turf";

const INITIAL_LIST = new SpotList();

INITIAL_LIST.addSpot(Spot.builder()
                        .name("Minneapolis")
                        .location({
                            lng: -93.26384,
                            lat: 44.97997
                        })
                        .build()
);
INITIAL_LIST.addSpot(Spot.builder()
                        .name("Chicago")
                        .location({
                            lng: -87.6298,
                            lat: 41.8781
                        })
                        .build()
);
INITIAL_LIST.addSpot(Spot.builder()
                        .name("Las Vegas")
                        .location({
                            lng: -115.137,
                            lat: 36.175
                        })
                        .build()
);
INITIAL_LIST.addSpot(Spot.builder()
                        .name("Incline Village")
                        .location({
                            lng: -119.9730,
                            lat: 39.2513
                        })
                        .build()
);
INITIAL_LIST.addSpot(Spot.builder()
                        .name("Hanoi")
                        .location({
                            lng: 105.8048,
                            lat: 21.0285
                        })
                        .build()
);

export const SOURCE_NAME = "flight-arc";
export const LAYER_NAME = "flight-arc-layer";



const TravelDiaryPage = () => {
    const tl = useRef<GSAPTimeline | null>(null);
    const [spotList, setSpotList] = useState<SpotList>(INITIAL_LIST);
    const [showInput, setShowInput] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [isPlay, setIsPlay] = useState<boolean>(false);

    useEffect(() => {
        tl.current = gsap.timeline();
        
        const tripNum = spotList.spots - 1;
        const trips = spotList.getTrips();
        for (let i = 0; i < tripNum; i++) {
            const trip = trips[i];
            const origin = turf.point([trip.start.lng, trip.start.lat]);
            const destination = turf.point([trip.end.lng, trip.end.lat]);
            const arcLine = turf.greatCircle(origin, destination, {npoints: 1000});
            const line = arcLine as GeoJSON.Feature<GeoJSON.LineString>;
            const totalLength = turf.length(arcLine);
            const animatedLine: GeoJSON.Feature<GeoJSON.LineString> = {
                type: "Feature",
                properties: [],
                geometry: {
                    type: "LineString",
                    coordinates: []
                }
            };
            mapRef.current?.addSource(`${SOURCE_NAME}-${i}`, {
                type: "geojson",
                "data": animatedLine
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
            
            const progress = { t: 0};
            tl.current.to(progress, {
                t: 1,
                duration: 2,
                onUpdate: () => {
                    const slices = turf.lineSliceAlong(line, 0, totalLength * progress.t);
                    animatedLine.geometry.coordinates = slices.geometry.coordinates;
                    const source = mapRef.current?.getSource(`${SOURCE_NAME}-${i}`) as mapboxgl.GeoJSONSource;
                    source.setData(animatedLine);
                }
            })
        

        }

        
        
        return () => {
            if (tl.current) {
                tl.current.kill();
                tl.current = null;
            }
        }
    }, [])
    return (
        <IsPlayContext
            value={isPlay}
        >
            <div className="flex">
                <div className="w-[30vw] h-screen flex flex-col gap-4">
                    <DiaryList
                        spotList={spotList}
                    />
                    <div className="flex flex-col gap-2">
                        {showInput && 
                                <div className="flex gap-4">
                                    <input
                                            className="border-2 p-2"
                                            placeholder="Place"
                                            value={query}
                                            onChange={e => setQuery(e.target.value)}
                                    />
                                    <button 
                                        className="bg-green-400 p-2"
                                        onClick={async () => {
                                            const geoCodeBody = (await searchCoordinate(query)) as GeoCodingResBody;
                                            const lng = geoCodeBody.results[0].geometry.location.lng;
                                            const lat = geoCodeBody.results[0].geometry.location.lat;
                                            const newList = spotList.clone();
                                            newList.addSpot(Spot.builder()
                                                                .name(query)
                                                                .location({
                                                                    lng: lng,
                                                                    lat: lat,
                                                                }).build()
                                            );
                                            setSpotList(newList)
                                        }}
                                    >Save</button>
                                </div>
                            }
                            <button 
                                className="p-[.5em] rounded-[.3em] bg-blue-200 cursor-pointer"
                                onClick={() => setShowInput(!showInput)}
                            >{showInput ? "Close" : "Add"}</button>
                            <button className="bg-amber-300 p-2 cursor-pointer"  onClick={() => setIsPlay(true)}>Play</button>
                        </div>
                    </div>
                <div className="w-[70vw] h-screen">
                    <TravelMap
                        mapRef={mapRef}
                        spotList={spotList}
                    />
                </div>
            </div>
         </IsPlayContext>
    );
};

export default TravelDiaryPage;