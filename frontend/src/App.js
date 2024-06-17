import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartPage from './Components/StartPage';
import TestPage from './Components/TestPage';
import EndTest from './Components/EndTest';

function App() {
  return (
    <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path='/testpage/:id' element={<TestPage/>} />
            <Route path='/end-page' element={<EndTest/>} />
          </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App