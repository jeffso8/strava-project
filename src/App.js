import React, { useState, useEffect} from 'react';
import './App.css';
import { Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';

function App() {
  return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={Login} />
            <Route exact path="/dashboard" Component={Dashboard} />
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
