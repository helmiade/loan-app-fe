import './App.css'
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import CustomerPage from "./pages/CustomerPage.jsx";
import {Outlet} from "react-router-dom";

function App() {
  return (
    <>
        <Outlet/>
    </>
  )
}

export default App
