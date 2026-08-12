import { useState } from "react";
import Map from "../components/Map";
import SearchTab, { type Place } from "../components/SearchTab";

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
            <SearchTab handleCenterChange={setCenter}/>
            <Map center={center}/>
        </div>
    );
};

export default LandingPage;