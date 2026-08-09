import Map from "./components/Map";
import SearchTab from "./components/SearchTab";

const App = () => {
  return (
    <div className="flex">
      <SearchTab/>
      <Map/>
    </div>

  );
};

export default App;