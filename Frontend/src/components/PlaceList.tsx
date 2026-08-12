import PlaceComponent from "./PlaceComponent";
import type { Place } from "./SearchTab";

type PlaceListProp = {
    places: Place[]
}

const PlaceList = ({places}: PlaceListProp) => {
    return (
        <div className="flex flex-wrap items-center justify-center h-full overflow-scroll gap-5">
            {places.map(place => (
                <PlaceComponent
                    name={place.displayName.text}
                    uri={place.photos[0].name}
                    maxHeightPx={place.photos[0].heightPx}
                    maxWidthPx={place.photos[0].widthPx}
                />
            ))}
        </div>
    );
};

export default PlaceList;