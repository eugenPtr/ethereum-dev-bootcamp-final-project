import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import Dashboard from './Dashboard';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import LendersProposal from './LendersProposal';
import BorrowersProposal from './BorrowersProposal';

ReactDOM.render(
  <BrowserRouter>
  <Routes>
  <Route exact path="/" element={<Home/>}/>
  <Route exact path="/dashboard" element={<Dashboard/>}/>
  <Route exact path="/create-proposal" element={<LendersProposal/>}/>
  <Route exact path="/proposals" element={<BorrowersProposal/>}/>
  </Routes>
</BrowserRouter>,
  document.getElementById('root')
);


