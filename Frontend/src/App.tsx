import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import TravelDiaryPage from "./pages/TravelDiaryPage";


const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/travel-diary" element={<TravelDiaryPage/>}/>
      </Routes>
    </>

  );
};

export default App;