type PlaceProp = {
    name: string,
    uri: string,
    maxWidthPx: number,
    maxHeightPx: number
}
const PlaceComponent = ({name, uri, maxHeightPx, maxWidthPx}: PlaceProp) => {
    const imgURL = import.meta.env.VITE_PLACE_PICTURE_API_URL + uri + `/media?key=${import.meta.env.VITE_PLACE_API_KEY}&maxHeightPx=${maxHeightPx}&maxWidthPx=${maxWidthPx}`
    return (
        <div>
            <div
                style={
                    {
                        width: "250px",
                        height: "250px",
                        backgroundImage: `url(${imgURL})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        
                    }
                }
            >

            </div>
            <p>{name}</p>
        </div>
    );
};

export default PlaceComponent;