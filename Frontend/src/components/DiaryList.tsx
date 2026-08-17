import type { SpotList } from "../features/SpotRender/SpotList";


const DiaryList = ({spotList}: {spotList: SpotList}) => {
    const spots = spotList.getSpotsList();
    return (
        <div>
            {spots.map(spot => (
                <input
                    value={spot.name}
                />
            ))}
        </div>
    );
};

export default DiaryList;