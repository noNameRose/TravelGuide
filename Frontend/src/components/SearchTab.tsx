import { useContext, useEffect, useRef, useState} from "react";
import type { CenterType } from "../pages/LandingPage";
import SearchRadiusContext from "../contexts/SearchRadiusContext";


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

type GeoCodingResult = {
    geometry: {
        location: {
            lat: number,
            lng: number
        }
    }
};

type GeoCodingResBody = {
    results: GeoCodingResult[]
};

type SearchTabProp = {
    handleCenterChange: (center: CenterType) => void,
    handleData: (places: Place[]) => void
};

type Prediction = {
    description: "string"
};

type PredictionResBody = {
    predictions: Prediction[];
}

const SearchTab = ({handleCenterChange, handleData}: SearchTabProp) => {
    const searchRadius = useContext(SearchRadiusContext);
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
        const changedQuery = query.replace(" ", "+");
        const geoCodingUrl = import.meta.env.VITE_GEOCODING_API_URL + `address=${changedQuery}&key=${import.meta.env.VITE_PLACE_API_KEY}`;
        const geoCodingResponse = await fetch(geoCodingUrl);
        const geoCodingBody = (await geoCodingResponse.json()) as GeoCodingResBody;
        const lat = geoCodingBody.results[0].geometry.location.lat;
        const lng = geoCodingBody.results[0].geometry.location.lng;
        handleCenterChange([lng, lat]);
        const response = await fetch(import.meta.env.VITE_PLACE_API_URL, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "X-Goog-FieldMask": "places.displayName,places.photos,places.location",
                "X-Goog-Api-Key": import.meta.env.VITE_PLACE_API_KEY
            },
            body: JSON.stringify({
                "includedTypes": ["tourist_attraction", "observation_deck", "state_park", "beach", "lake"],
                "locationRestriction": {
                    "circle": {
                        "center": {
                            "latitude": lat,
                            "longitude": lng,
                        },
                        "radius": searchRadius * 1000
                    }
                }
            })
        });
        const body = (await response.json()) as ResponseBody;
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