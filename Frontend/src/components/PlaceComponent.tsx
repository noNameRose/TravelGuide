type PlaceProp = {
    name: string,
    uri: string
}
const PlaceComponent = ({name, uri}: PlaceProp) => {
    return (
        <div>
            <p>{name}</p>
        </div>
    );
};

export default PlaceComponent;