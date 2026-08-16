const searchPlaces = async (location: [number, number], searchRadius: number) => {
    const [lng, lat] = location;
    const response = await fetch(import.meta.env.VITE_PLACE_API_URL, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "X-Goog-FieldMask": "places.displayName,places.photos,places.location",
            "X-Goog-Api-Key": import.meta.env.VITE_PLACE_API_KEY,
        },
        body: JSON.stringify({
            "includedTypes": ["tourist_attraction", "observation_deck", "state_park", "beach", "lake"],
            "locationRestriction": {
                "circle": {
                    "center": {
                        "latitude": lat,
                        "longitude": lng
                    },
                    "radius": searchRadius
                }
            }
        })
    });
    return response.json();
};

export default searchPlaces;