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
            <img src={imgURL}/>
            <p>{name}</p>
        </div>
    );
};

export default PlaceComponent;