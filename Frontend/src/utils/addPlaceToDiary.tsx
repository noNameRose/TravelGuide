export type AddPlaceRequest = {
    name: string,
    lng: number,
    lat: number,
    googlePlaceId: string,
    getHereBy: string | null
};

const addPlaceToDiary = async (
    request: AddPlaceRequest,
    diaryId: string | null,
    accessToken: string
) => {
    const response = await fetch(import.meta.env.VITE_SERVER_ORIGIN + `/place/${diaryId}`, 
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...request
            })
        }
    );
    if (response.ok) {
        const body = (await response.json()) as number;
        console.log(body);
    }
};

export default addPlaceToDiary;