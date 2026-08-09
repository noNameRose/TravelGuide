import { useState} from "react";


type Place = {
    displayName: {
        text: string,
        languageCode: string
    }
};

type ResponseBody = {
    places: Place[]
};

type GeoCodingResult = {
    geometry: {
        lat: number,
        lg: number
    }
};

type GeoCodingResBody = {
    results: GeoCodingResult[]
}

const SearchTab = () => {
    const [query, setQuery] = useState<string>("");
    const [data, setData] = useState<Place[]>([]);

    const handleSearch = async () => {
        const response = await fetch(import.meta.env.VITE_PLACE_API_URL, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "X-Goog-FieldMask": "places.displayName",
                "X-Goog-Api-Key": import.meta.env.VITE_PLACE_API_KEY
            },
            body: JSON.stringify({
                "includedTypes": ["tourist_attraction", "observation_deck", "state_park"],
                "locationRestriction": {
                    "circle": {
                        "center": {
                            "latitude": 41.8781,
                            "longitude": -87.6298,
                        },
                        "radius": 5000.0
                    }
                }
            })
        });
        const body = (await response.json()) as ResponseBody;
        setData(body.places);
    }
    return (
        <div className="w-[50vw] h-screen">
                <label className="flex gap-4">
                    <input 
                        className="border-2 p-1.5"
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)} 
                        placeholder="Place"
                    />
                    <button className="border-2 bg-amber-400 p-1.5 font-bold rounded-xl " onClick={handleSearch}>Search</button>
                </label>
            
            {data.map(place => (<div>{place.displayName.text}</div>))}
        </div>
    );
};

export default SearchTab;