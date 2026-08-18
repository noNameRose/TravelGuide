import { createContext } from "react";

type IsPlayType = {
    isPlay: boolean,
    handlePlayChange: (isPlay: boolean) => void
}

const IsPlayContext = createContext<IsPlayType | null>(null);

export default IsPlayContext;