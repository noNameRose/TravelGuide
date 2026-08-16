import { createContext } from "react";

type SearchChingRadiusType = {
    radius: number,
    handleRadiusChange: (func: ((range: number) => number)) => void,
    maxRadius: number,
    minRadius: number
};

const SearchRadiusContext = createContext<SearchChingRadiusType | null>(null);

export default SearchRadiusContext;