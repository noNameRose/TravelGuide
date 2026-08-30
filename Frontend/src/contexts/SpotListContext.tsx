import { createContext } from "react";
import type { SpotList } from "../features/SpotRender/SpotList";

const SpotListContext = createContext<SpotList | null>(null);

export default SpotListContext;