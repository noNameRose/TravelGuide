import { useContext, useEffect, useRef, useState} from "react";
import type { CenterType } from "../pages/ExplorePage";
import SearchRadiusContext from "../contexts/SearchRadiusContext";
import searchPlaces from "../utils/searchPlaces";
import searchCoordinate, { type GeoCodingResBody } from "../utils/searchCoordinate";


export type Place = {
    location: Location
    displayName: {
        text: string,
        languageCode: string
    },
    photos: Photo[]
};

type Location = {
    latitude: number,
    longitude: number
}

type Photo = {
    name: string,
    widthPx: number,
    heightPx: number
};

type ResponseBody = {
    places: Place[]
};


type SearchTabProp = {
    handleCenterChange: (center: CenterType) => void,
    handleData: (places: Place[]) => void,
    handleLocationChange: (location: [number, number]) => void
};

type Prediction = {
    description: "string"
};

type PredictionResBody = {
    predictions: Prediction[];
}

const SearchTab = ({handleCenterChange, handleData, handleLocationChange}: SearchTabProp) => {
    const searchRadiusContext = useContext(SearchRadiusContext);
    const [query, setQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<Prediction[]>([]);
    const sessionToken = useRef<string>(crypto.randomUUID());
    const timeoutId = useRef<number | null>(null);
    const DEBOUNCE_TIME = 1000;

    // useEffect(() => {
    //     if (timeoutId.current) {
    //         clearTimeout(timeoutId.current);
    //     }
    //     timeoutId.current = setTimeout(async () => {
    //         const predictionURL = import.meta.env.VITE_PREDICTION_API_URL + `input=${query}&key=${import.meta.env.VITE_PLACE_API_KEY}`;
    //         const predictionResponse = await fetch(predictionURL);
    //         const body = (await predictionResponse.json()) as PredictionResBody;
    //         setSearchResults(body.predictions);
    //     }, DEBOUNCE_TIME);
    // }, [query]);

    const handleSearch = async () => {
        const geoCodingBody = (await searchCoordinate(query)) as GeoCodingResBody;
        const lat = geoCodingBody.results[0].geometry.location.lat;
        const lng = geoCodingBody.results[0].geometry.location.lng;
        handleCenterChange([lng, lat]);
        handleLocationChange([lng, lat]);
        const body = (await searchPlaces([lng, lat], (searchRadiusContext?.radius as number) * 1000));
        handleData(body.places);
    };

    return (
        <div>
            <label className="flex gap-4">
                <input 
                    className="border-2 p-1.5"
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="Place"
                />
                <button className="border-2 bg-amber-400 p-1.5 font-bold rounded-xl " onClick={handleSearch}>Search</button>
            </label>
        </div>
    );
};

export default SearchTab;