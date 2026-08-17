import type { SpotList } from "../features/SpotRender/SpotList";


const DiaryList = ({spotList}: {spotList: SpotList}) => {
    const spots = spotList.getSpotsList();
    return (
        <div className="flex flex-col gap-4">
            {spots.map(spot => (
                <input
                    key={spot.name}
                    className="p-2 font-medium border-2 rounded-3xl"
                    value={spot.name}
                />
            ))}
        </div>
    );
};

export default DiaryList;