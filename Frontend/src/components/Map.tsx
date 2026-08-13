import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { CenterType } from "../pages/LandingPage";
import type { Place } from "./SearchTab";
import Marker from "./Marker";

const INITIAL_CENTER = [
    -74.0242,
    40.6941
];

const INITIAL_ZOOM = 10.12;

const Map = ({center, places}: {center: CenterType, places: Place[]}) => {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const [zoom, setZoom] = useState<number>(INITIAL_ZOOM);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

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
        mapRef.current?.flyTo({
            center: center,
            zoom: zoom
        });
    }, [center]);

    return (
        <>
            <div id="map-container" ref={mapContainerRef} className="w-[50vw] min-h-screen"></div>
            {mapLoaded && (
                places.map(place => (
                    <Marker
                        key={place.displayName.text}
                        map={mapRef.current as mapboxgl.Map}
                        imgName={place.photos[0].name}
                        location={[place.location.longitude, place.location.latitude]}
                        placeName={place.displayName.text}
                    />
                ))
            )}
        </>
    );
};

export default Map;