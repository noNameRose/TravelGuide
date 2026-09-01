type UserResBody = {
    email: string,
    name: string
}

const getUserProfile = async (accessToken: string) => {
    const response = await fetch(import.meta.env.VITE_SERVER_ORIGIN + "/user", {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
    if (response.ok) {
        const body = (await response.json()) as UserResBody;
        return body;
    }
};

export default getUserProfile;