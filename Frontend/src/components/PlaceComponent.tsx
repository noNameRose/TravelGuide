type PlaceProp = {
    name: string,
    uri: string
}
const PlaceComponent = ({name, uri}: PlaceProp) => {
    const imgURL = import.meta.env.VITE_PLACE_PICTURE_API_URL + uri + `/media?key=${import.meta.env.VITE_PLACE_API_KEY}&maxHeightPx=${100}&maxWidthPx=${100}`
    return (
        <div>
            <image href={imgURL}/>
            <p>{name}</p>
        </div>
    );
};

export default PlaceComponent;