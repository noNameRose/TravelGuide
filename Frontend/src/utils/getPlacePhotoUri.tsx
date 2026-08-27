import searchCoordinate, { type GeoCodingResBody } from "./searchCoordinate";

type PhotoResponseBody = {
    photos: Photo[]
}

type Photo = {
    name: string,
    widthPx: number, 
    heightPx: number
};

const getPlacePhotoUri = async (placeName: string) => {
    const geocodeResponse = (await searchCoordinate(placeName)) as GeoCodingResBody;
    const placeId = geocodeResponse.results[0].place_id;
    const response = await fetch(import.meta.env.VITE_PLACE_DETAILS_URL + placeId, {
        headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": import.meta.env.VITE_PLACE_API_KEY,
            "X-Goog-FieldMask": "photos"
        }
    });
    const body = (await response.json()) as PhotoResponseBody;
    return import.meta.env.VITE_PLACE_PICTURE_API_URL + body.photos[0].name + `/media?key=${import.meta.env.VITE_PLACE_API_KEY}&maxHeightPx=${body.photos[0].heightPx}&maxWidthPx=${body.photos[0].widthPx}`;
};

export default getPlacePhotoUri;