import type { SpotList } from "../features/SpotRender/SpotList";


const DiaryList = ({spotList}: {spotList: SpotList}) => {
    const spots = spotList.getSpotsList();
    return (
        <div className="flex flex-col">
            {spots.map(spot => (
                <input
                    value={spot.name}
                />
            ))}
        </div>
    );
};

export default DiaryList;