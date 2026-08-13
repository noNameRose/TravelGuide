import { createContext } from "react";
import type { Place } from "../components/SearchTab";

type SelectedPlaceProp = {
    selectedPlaced: Place | null,
    setSelectedPlaced: (place: Place) => void
};

const SelectedPlaceContext = createContext<SelectedPlaceProp | null>(null);

export default SelectedPlaceContext;