import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home.js';
import TaxonomyMapping from './pages/taxonomy-mapping.js';

function App() {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/taxonomy-mapping" element={<TaxonomyMapping />} />
      </Routes>
    </Router>
  );
}

export default App;
