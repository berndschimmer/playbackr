import Audio from "./Audio";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { IoSettingsSharp } from "react-icons/io5";
import Settings from "./Settings";
import "./App.css";

const App = () => {
  const redordings = [1, 2, 3, 4, 5, 6];
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/settings" element={<Settings />}></Route>

          <Route
            path="/"
            element={
              <div>
                {redordings.map((key) => (
                  <Audio key={key} record={key}></Audio>
                ))}
                <Link to="/settings">
                  <IoSettingsSharp className="settings" />
                </Link>
              </div>
            }
          ></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
