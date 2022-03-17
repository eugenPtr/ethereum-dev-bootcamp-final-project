import React from "react";
import {useState, useEffect} from "react";
import * as Wallet from "./components/Wallet";
import {ethers} from "ethers"
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import UnconnectedNavBar from "./UnconnectedNavBar";

export default function Home() {
    const [connectedAccount, setConnectedAccount] = useState("");
    const [connectedContract, setConnectedContract] = useState(null);
   
    
    const checkWalletConnection = async () => {
      await Wallet.checkIfWalletIsConnected(setConnectedAccount, setConnectedContract);
    }
  
    useEffect( () => {
      checkWalletConnection();
  
      console.log("Connected contract ", connectedContract);
      console.log("Connected account:", connectedAccount);
    }, []);

    console.log(connectedAccount);
    const NotConnectedHome = () => (
        <div>
        <div className="App">
      <UnconnectedNavBar />
      <header className="App-header">
        <h1>Welcome to RMDAPP</h1>
        <subtitle className="App-subtitle">
          The World's first decentralized peer to peer reverse mortage
          application.
        </subtitle>
        <subtitle className="App-subtitle">
          Revolutionizing the mortgage industry.
        </subtitle>
        <p></p>
        <Link to="/lendersproposal">
          <button className="button2">Connect Wallet</button>
        </Link>
      </header>
    </div>
        </div>
    );

    const connectedHome = () =>(
        <div>
        <div className="App">
      <NavBar />
      <header className="App-header">
        <h1>Welcome to RMDAPP</h1>
        <subtitle className="App-subtitle">
          The World's first decentralized peer to peer reverse mortage
          application.
        </subtitle>
        <subtitle className="App-subtitle">
          Revolutionizing the mortgage industry.
        </subtitle>
        <p></p>
        <Link to="/lendersproposal">
          <button className="button2">Create Proposal</button>
        </Link>
      </header>
    </div>
        </div>
    )
    
   
  return (
      <div>
    {connectedAccount === "" ? NotConnectedHome() : connectedHome()}
    </div>
  );
 
}



