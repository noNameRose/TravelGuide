
export type Diary = {
    name: string,
    diaryId: string
}

const getDiaries = async (accessToken: string) => {
    const response = await fetch(import.meta.env.VITE_SERVER_ORIGIN + "/diary", {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
    if (response.ok) {
        const body = (await response.json()) as Diary[];
        return body;
    }
};

export default getDiaries;