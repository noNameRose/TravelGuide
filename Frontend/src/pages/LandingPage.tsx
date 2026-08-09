import Map from "../components/Map";
import SearchTab from "../components/SearchTab";

const LandingPage = () => {
    return (
        <div className="flex">
            <SearchTab/>
            <Map/>
        </div>
    );
};

export default LandingPage;