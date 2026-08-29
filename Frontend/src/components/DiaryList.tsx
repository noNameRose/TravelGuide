import type { SpotList } from "../features/SpotRender/SpotList";
import SpotComponent from "./SpotComponent";


const DiaryList = ({spotList}: {spotList: SpotList}) => {
    const spots = spotList.getSpotsList();
    return (
        <div className="flex flex-col items-center w-full">
            {spots.map(spot => (
                <>
                    {spot.getHereBy && (
                        <div className="w-[80%] h-[10rem] relative">
                            <div className="h-full w-[5%] bg-blue_200 absolute left-1/2 top-0 -translate-x-1/2">

                            </div>
                        </div>
                    )}
                    <SpotComponent
                        name={spot.name}
                    />
                </>
            ))}
        </div>
    );
};

export default DiaryList;