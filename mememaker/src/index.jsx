import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import MemeMakerApp from './MemeMakerApp.jsx'
import MemeMakerEditPage from './MemeMakerEditPage.jsx';
import MemeMakerComplete from './MemeMakerComplete.jsx';
import MemeMakerDownload from './MemeMakerDownload.jsx';
import MemeMakerSee from './MemeMakerSee.jsx';
import MemeFeed from './MemeFeed.jsx';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<MemeMakerApp />} />
      <Route path="/edit" element={<MemeMakerEditPage />} />
      <Route path="/complete" element={<MemeMakerComplete />} />
      <Route path="/download" element={<MemeMakerDownload />} />
      <Route path="/see" element={<MemeMakerSee />} />
      <Route path="/feed" element={<MemeFeed />} />
    </Routes>
  </BrowserRouter>
)