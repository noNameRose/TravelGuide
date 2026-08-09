import { useState } from "react";
import Map from "../components/Map";
import SearchTab from "../components/SearchTab";

export type CenterType = [number, number];

const INITIAL_CENTER = [
    -74.0242,
    40.6941
];

const LandingPage = () => {
    const [center, setCenter] = useState<CenterType>(INITIAL_CENTER as CenterType);
    
    return (
        <div className="flex">
            <SearchTab/>
            <Map center={center}/>
        </div>
    );
};

export default LandingPage;