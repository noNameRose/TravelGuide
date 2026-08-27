import type { SpotList } from "../features/SpotRender/SpotList";
import SpotComponent from "./SpotComponent";


const DiaryList = ({spotList}: {spotList: SpotList}) => {
    const spots = spotList.getSpotsList();
    return (
        <div className="flex flex-col gap-4">
            {spots.map(spot => (
                <SpotComponent
                    name={spot.name}
                />
            ))}
        </div>
    );
};

export default DiaryList;