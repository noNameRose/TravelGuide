import { useContext, useEffect, useRef, useState } from "react";
import mapboxgl, { GeoJSONSource} from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { CenterType } from "../pages/ExplorePage";
import type { Place } from "./SearchTab";
import Marker from "./Marker";
import SelectedPlaceContext from "../contexts/SelectedPlaceContext";
import * as turf from "@turf/turf";
import RangeController from "./RangeController";
import SearchRadiusContext from "../contexts/SearchRadiusContext";

const INITIAL_ZOOM = 10.12;

const Map = ({center, places}: {center: CenterType, places: Place[]}) => {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const [zoom] = useState<number>(INITIAL_ZOOM);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const searchRadiusContext = useContext(SearchRadiusContext);

    useEffect(() => {
        mapRef.current = new mapboxgl.Map({
            accessToken: import.meta.env.VITE_MAPBOX_API,
            container: mapContainerRef.current as HTMLDivElement,
            center: center,
            zoom: zoom
        });

        mapRef.current.on("load", () => {
            setMapLoaded(true);
        });

        return () => {
            mapRef.current?.remove();
        }
    }, []);
    
    useEffect(() => {
        if (!mapRef.current) {
            return;
        }

        mapRef.current.flyTo({
            center: center,
            zoom: zoom
        });
        if (mapLoaded) {
            const circle = turf.circle(center, (searchRadiusContext?.radius as number), {units: "kilometers"});

            mapRef.current.addSource("circle-source", {
                type: "geojson",
                data: circle
            });

            mapRef.current.addLayer({
                id: "circle",
                type: "fill",
                source: "circle-source",
                paint: {
                    'fill-color': '#007cbf',
                    'fill-opacity': 0.3
                }
            });
        }

        return () => {
            if (!mapRef.current || !mapLoaded) {
                return;
            }
            if (mapRef.current.getLayer("circle")) {
                mapRef.current.removeLayer("circle");
            }
            if (mapRef.current.getSource("circle-source")) {
                mapRef.current.removeSource("circle-source");
            }
        }
    }, [center]);

    useEffect(() => {
        if (mapRef.current && mapRef.current.getSource("circle-source")) {
        const circle = turf.circle(center, (searchRadiusContext?.radius as number), {units: "kilometers"});
           const source =  (mapRef.current.getSource("circle-source") as GeoJSONSource);
           source.setData(circle);
        }
    }, [searchRadiusContext]);

    useEffect(() => {
        if (!selectedPlace)
            return;
        mapRef.current?.flyTo({
            center: [selectedPlace.location.longitude, selectedPlace.location.latitude],
            zoom: 14
        })
    }, [selectedPlace]);

    return (
        <>
            <div id="map-container" ref={mapContainerRef} className="w-[50vw] min-h-screen">
                <RangeController/>
            </div>
            <SelectedPlaceContext
                value={
                    {
                        selectedPlaced: selectedPlace,
                        setSelectedPlaced: setSelectedPlace
                    }
                }
            >
                {mapLoaded && (
                places.map(place => (
                    <Marker
                        key={place.displayName.text}
                        map={mapRef.current as mapboxgl.Map}
                        imgName={place.photos[0].name}
                        location={[place.location.longitude, place.location.latitude]}
                        place={place}
                    />
                ))
            )}
            </SelectedPlaceContext>
        </>
    );
};

export default Map;