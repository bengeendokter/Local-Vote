"use client"
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home/page';

const App = () =>
{

  return (
    <Router>
      <Routes>
        <Route path="/about" element={<h1>About</h1>} />
        <Route path="/" element={<Home></Home>} />
      </Routes>
    </Router>
  );
}

export default App;