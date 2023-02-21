import { useContext, useEffect, useState } from "react";
import "./App.css";

import supabase from "./lib/supabase/dbApi";
import NavBar from "./components/NavBar/NavBar";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Index";
import Login from "./pages/Login/Index";
import Regester from "./pages/Regester/Index";
import AppContext from "./components/context/AppContext";
import Subject from "./pages/Subjects/Index";

function App() {
  const [appData, setAppData] = useContext(AppContext);

  useEffect(() => {
    console.log("useEffect");
    init();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="appBody">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Regester" element={<Regester />} />
          <Route path="/Subject" element={<Subject />} />
        </Routes>
      </div>
    </div>
  );

  async function init() {
    setAppData((prev) => {
      return {
        ...prev,
        NavItems: [
          { Url: "/", Name: "Home" },
          { Url: "/Regester", Name: "Regester" },
          {
            Url: "/Subject",
            Name: "Subject",
            init: () => {
              console.log("Calling subject init method");
            },
          },
        ],
      };
    });

    const session = await supabase.auth.getSession();
    setAppData((prev) => {
      if (session.data.session == null) {
        return prev;
      }
      return {
        ...prev,
        auth: session.data.session,
      };
    });
  }
}

export default App;
