import TravelMap from "../components/TravelMap";

const TravelDiaryPage = () => {
    return (
        <div className="flex">
            <div className="w-[30vw] h-screen">
            </div>
            <div className="w-[70vw] h-screen">
                <TravelMap
                />
            </div>
        </div>
    );
};

export default TravelDiaryPage;