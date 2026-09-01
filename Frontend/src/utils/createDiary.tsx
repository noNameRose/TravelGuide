

const createDiary = async (name: string, accessToken: string) => {
    const response = await fetch(import.meta.env.VITE_SERVER_ORIGIN, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            name: name
        });
    });
}