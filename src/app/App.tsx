import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./page";
import UserInfo from "../pages/userinfo"; // Update the import statement
// ...existing code...

function App() {
  return (
    <Router>
      <Routes>
        {/* ...existing routes... */}
        <Route path="/" element={<Home />} />
        <Route path="/Userinfo" element={<UserInfo />} />
        {/* ...existing routes... */}
      </Routes>
    </Router>
  );
}

export default App;
