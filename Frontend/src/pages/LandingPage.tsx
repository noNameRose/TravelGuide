import { useState } from "react";
import Map from "../components/Map";
import SearchTab, { type Place } from "../components/SearchTab";
import PlaceList from "../components/PlaceList";
import SearchRadiusContext from "../contexts/SearchRadiusContext";

export type CenterType = [number, number];

const INITIAL_CENTER = [
    -74.0242,
    40.6941
];

const INITIAL_SEARCH_RADIUS = 2;
const MAX_SEARCH_RADIUS = 10;

const LandingPage = () => {
    const [center, setCenter] = useState<CenterType>(INITIAL_CENTER as CenterType);
    const [searchRadius, setSearchRadius] = useState<number>(INITIAL_SEARCH_RADIUS);
    const [data, setData] = useState<Place[]>([]);
    return (
        <SearchRadiusContext
            value={searchRadius}
        >
            <div className="flex">
                <div className="w-[50vw] h-screen">
                    <SearchTab 
                        handleCenterChange={setCenter}
                        handleData={setData}
                    />
                    <PlaceList
                        places={data}
                    />
                </div>
                <Map 
                    center={center} 
                    places={data}
                />
            </div>
        </SearchRadiusContext>
    );
};

export default LandingPage;