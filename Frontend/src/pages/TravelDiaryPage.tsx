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
INITIAL_LIST.addSpot(Spot.builder()
                        .name("Hanoi")
                        .location({
                            lng: 105.8048,
                            lat: 21.0285
                        })
                        .build()
);




const TravelDiaryPage = () => {
    const [spotList, setSpotList] = useState<SpotList>(INITIAL_LIST);
    const [showInput, setShowInput] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    return (
        <div className="flex">
            <div className="w-[30vw] h-screen flex flex-col gap-4">
                <DiaryList
                    spotList={spotList}
                />
                <div className="flex flex-col gap-2">
                    {showInput && 
                            <div className="flex gap-4">
                                <input
                                        className="border-2 p-2"
                                        placeholder="Place"
                                        value={query}
                                        onChange={e => setQuery(e.target.value)}
                                />
                                <button className="bg-green-400 p-2">Save</button>
                            </div>
                        }
                        <button 
                            className="p-[.5em] rounded-[.3em] bg-blue-200 cursor-pointer"
                            onClick={() => setShowInput(!showInput)}
                        >{showInput ? "Close" : "Add"}</button>
                    </div>
                </div>
            <div className="w-[70vw] h-screen">
                <TravelMap
                    trips={spotList.getTrips()}
                />
            </div>
        </div>
    );
};

export default TravelDiaryPage;