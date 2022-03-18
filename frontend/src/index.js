import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import Dashboard from './Dashboard';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import LendersProposal from './LendersProposal';
import BorrowersProposal from './BorrowersProposal';
import Marketplace from './Marketplace';

ReactDOM.render(
  <BrowserRouter>
  <Routes>
  <Route exact path="/" element={<Home/>}/>
  <Route exact path="/dashboard" element={<Dashboard/>}/>
  <Route exact path="/lendersproposal" element={<LendersProposal/>}/>
  <Route exact path="/borrowersproposal" element={<BorrowersProposal/>}/>
  <Route exact path="/marketplace" element={<Marketplace/>}/>
  </Routes>
</BrowserRouter>,
  document.getElementById('root')
);


