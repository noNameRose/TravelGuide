export class InvalidAccessTokenException extends Error {
    constructor(message: string) {
        super(message);
    }
}