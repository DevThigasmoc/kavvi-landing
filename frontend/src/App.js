import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import LandingPage from "./components/LandingPage";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TestBackend = () => {
  const helloWorldApi = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log('Backend connection:', response.data.message);
    } catch (e) {
      console.error('Backend connection error:', e);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  return null; // This is just for testing backend connection
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <TestBackend />
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;