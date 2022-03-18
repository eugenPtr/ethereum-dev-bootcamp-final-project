import './Marketplace.css'
import NavBar from './NavBar';


function Marketplace() {

  return (
    <div className="App">
    <NavBar/>
      <header className="App-header">
      <div className="App-header-sub">
      <h1>Welcome To Marketplace</h1>
   <p></p>
      </div>
      <div className="parentbox">

      <div className="bufferbox">
  
      <div className="childbox1">
      
     <div className="type">OFFERING</div>
     <div className="terms">Maximum Loan Amount</div>
      
      </div>
      <div className="childbox1">WANTED</div>
      <div className="childbox1">OFFERING</div>
      <div className="childbox1">WANTED</div>
      <div className="childbox1">OFFERING</div>
      <div className="childbox1">WANTED</div>
  
      </div>
      
      
      </div>
       
      </header>
    </div>
  );
}

export default Marketplace;