type GeoCodingResult = {
    geometry: {
        location: {
            lat: number,
            lng: number
        }
    }
};

export type GeoCodingResBody = {
    results: GeoCodingResult[]
};

const searchCoordinate = async (query: string) => {
    const changeQuery = query.replace(" ", "+");
    const geoCodingUrl = import.meta.env.VITE_GEOCODING_API_URL + `address=${changeQuery}&key=${import.meta.env.VITE_PLACE_API_KEY}`;
    const geoCodingResponse = await fetch(geoCodingUrl);
    return geoCodingResponse.json();
};

export default searchCoordinate;