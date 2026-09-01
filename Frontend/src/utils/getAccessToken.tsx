export type AccessTokenResBody = {
    accessToken: string
};

const getAccessToken = async () => {
    const response = await fetch(import.meta.env.VITE_SERVER_ORIGIN + "/auth/access_token", {
        credentials: "include"
    });
    if (response.ok) {
        const body = (await response.json()) as AccessTokenResBody;
        return body.accessToken;
    }
};

export default getAccessToken;