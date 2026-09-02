import type { Transportation } from "../features/SpotRender/Spot";

export type PlaceResponse = {
    name: string,
    googlePlaceId: string,
    getHereBy: Transportation,
    lat: number,
    lng: number
}

const getPlaceList = async (diaryId: string, accessToken: string) => {
    const response = await fetch(import.meta.env.VITE_SERVER_ORIGIN + `/place/${diaryId}`,
        {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }
    );
    if (response.ok) {
        const body = (await response.json()) as PlaceResponse[];
        return body;
    }
};

export default getPlaceList;