import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import TravelDiaryPage from "./pages/TravelDiaryPage";
import LoginPage from "./pages/LoginPage";
import ExplorePage from "./pages/ExplorePage";
import EditDiaryPage from "./pages/EditDiaryPage";


const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/explore" element={<ExplorePage/>}/>
        <Route path="/travel-diary" element={<TravelDiaryPage/>}/>
        <Route path="/edit" element={<EditDiaryPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
      </Routes>
    </>
  );
};

export default App;