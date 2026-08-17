import RatingList from "./RatingList";

type PlaceProp = {
    name: string,
    uri: string,
    maxWidthPx: number,
    maxHeightPx: number
}
const PlaceComponent = ({name, uri, maxHeightPx, maxWidthPx}: PlaceProp) => {
    const imgURL = import.meta.env.VITE_PLACE_PICTURE_API_URL + uri + `/media?key=${import.meta.env.VITE_PLACE_API_KEY}&maxHeightPx=${maxHeightPx}&maxWidthPx=${maxWidthPx}`
    return (
        <div 
            className="flex flex-col gap-2 p-3 pb-[5rem]"
            style={
                {
                    backgroundColor: "white",
                    borderRadius: "1.75rem"
                }
            }
        >
            <div
                className="rounded-2xl"
                style={
                    {
                        width: "270px",
                        height: "180px",
                        backgroundImage: `url(${imgURL})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }
                }
            >
            </div>
            <div className="flex flex-col gap-2 w-[270px]">
                <p className="font-medium">{name}</p>
                <RatingList/>
            </div>
        </div>
    );
};

export default PlaceComponent;