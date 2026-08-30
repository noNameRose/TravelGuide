import { createContext } from "react";
import type { SpotList } from "../features/SpotRender/SpotList";

type ContextType = {
    spotList: SpotList,
    handleSpotListChange: (list: SpotList) => void
}

const SpotListContext = createContext<ContextType | null>(null);

export default SpotListContext;