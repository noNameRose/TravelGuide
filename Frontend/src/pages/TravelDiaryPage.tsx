import { useState } from "react";
import TravelMap from "../components/TravelMap";
import { Spot } from "../features/SpotRender/Spot";
import { SpotList } from "../features/SpotRender/SpotList";
import DiaryList from "../components/DiaryList";

const INITIAL_LIST = new SpotList();

INITIAL_LIST.addSpot(Spot.builder()
                        .name("Minneapolis")
                        .location({
                            lng: -93.26384,
                            lat: 44.97997
                        })
                        .build()
);
INITIAL_LIST.addSpot(Spot.builder()
                        .name("Chicago")
                        .location({
                            lng: -87.6298,
                            lat: 41.8781
                        })
                        .build()
);
INITIAL_LIST.addSpot(Spot.builder()
                        .name("Las Vegas")
                        .location({
                            lng: -115.137,
                            lat: 36.175
                        })
                        .build()
);
INITIAL_LIST.addSpot(Spot.builder()
                        .name("Incline Village")
                        .location({
                            lng: -119.9730,
                            lat: 39.2513
                        })
                        .build()
);




const TravelDiaryPage = () => {
    const [spotList, setSpotList] = useState<SpotList>(INITIAL_LIST);
    return (
        <div className="flex">
            <div className="w-[30vw] h-screen">
                <DiaryList
                    spotList={spotList}
                />
            </div>
            <div className="w-[70vw] h-screen">
                <TravelMap
                />
            </div>
        </div>
    );
};

export default TravelDiaryPage;