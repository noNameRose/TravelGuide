import { InvalidAccessTokenException } from "../exceptions/InvalidAccessTokenException";
import getAccessToken from "./getAccessToken";

type UserResBody = {
    email: string,
    name: string
};

type HeaderType = {
    "Authorization": string
}

const getUserProfile = async (accessToken: string | null) => {
    let headers: HeaderType | {} = {
        "Authorization": `Bearer ${accessToken}`
    };
    if (accessToken === null) {
        headers = {};
    }
    const response = await fetch(import.meta.env.VITE_SERVER_ORIGIN + "/user", {
        headers: headers
    });
    if (response.ok) {
        const body = (await response.json()) as UserResBody;
        return body;
    }
    else {
        throw new InvalidAccessTokenException("Token is in valid");
    }
};

export default getUserProfile;