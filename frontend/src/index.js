import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import Dashboard from './Dashboard';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
  <Routes>
  <Route exact path="/" element={<Home/>}/>
  <Route exact path="/dashboard" element={<Dashboard/>}/>
  </Routes>
</BrowserRouter>,
  document.getElementById('root')
);


