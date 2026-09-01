

const createDiary = async (name: string, accessToken: string) => {
    const response = await fetch(import.meta.env.VITE_SERVER_ORIGIN + "/diary", {
        method: "Post",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            diaryName: name
        })
    });
};

export default createDiary;