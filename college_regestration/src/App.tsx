import { useContext, useEffect, useState } from "react";
import "./App.css";

import supabase from "./lib/supabase/dbApi";
import NavBar from "./components/NavBar/NavBar";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Index";
import Login from "./pages/Login/Index";
import Register from "./pages/Register/Index";
import AppContext from "./components/context/AppContext";
import Subject from "./pages/Subjects/Index";
import ClassTT from "./pages/ClassTimeTable/Index";
import { UserMetadata } from "./lib/types/types";
import Fingerprint from "./pages/fingerprint";

function App() {
  const [appData, setAppData] = useContext(AppContext);

  const metaData = appData.auth
    ? (appData.auth.user.user_metadata as UserMetadata)
    : undefined;

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
          {appData.auth != undefined ? (
            <></>
          ) : (
            <Route path="/Login" element={<Login />} />
          )}
          <Route path="/Register" element={<Register />} />
          <Route path="/Subject" element={<Subject />} />
          <Route path="/TimeTable" element={<ClassTT />} />
          <Route path="/Fingerprint" element={<Fingerprint />} />
        </Routes>
      </div>
    </div>
  );

  async function init() {
    setAppData((prev) => {
      return {
        ...prev,
        NavItems: [
          {
            Url: "/",
            Name: "Home",
            RolesPermited: ["Student", "Teacher", "Staff"],
          },
          { Url: "/Register", Name: "Register", RolesPermited: ["Staff"] },
          {
            Url: "/Subject",
            Name: "Subject",
            RolesPermited: ["Student", "Teacher", "Staff"],
          },
          {
            Url: "/TimeTable",
            Name: "TimeTable",
            RolesPermited: ["Student", "Teacher", "Staff"],
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
