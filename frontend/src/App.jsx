import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import { UserContext } from "./context/UserContext.jsx";

function App() {
  const { userData } = useContext(UserContext);

  if (userData === false) {
    return <h1 className="text-center font-bold text-2xl mt-5">Loading...</h1>
  }
  
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={userData ? <Home /> : <Navigate to={"/login"} replace />} />
        <Route path="/profile" element={userData ? <Profile /> : <Navigate to={"/login"} replace />} />
      </Routes>
    </>
  );
}

export default App;
