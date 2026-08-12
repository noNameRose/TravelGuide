import { useState } from "react";
import Map from "../components/Map";
import SearchTab, { type Place } from "../components/SearchTab";
import PlaceList from "../components/PlaceList";

export type CenterType = [number, number];

const INITIAL_CENTER = [
    -74.0242,
    40.6941
];

const LandingPage = () => {
    const [center, setCenter] = useState<CenterType>(INITIAL_CENTER as CenterType);
    const [data, setData] = useState<Place[]>([]);
    return (
        <div className="flex">
            <div>
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
    );
};

export default LandingPage;