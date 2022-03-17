import "./NavBar.css";
import { Link } from "react-router-dom";

const NavBar = () => (
    <div class="allNavBar">
    <header className='navbar'>
        <div className='navbar__title navbar__item'>
        <Link to="/">RMDAPP</Link></div>
        <div className='navbar__item'>
        <Link to="/lendersproposal">New Proposal</Link>
        </div>
        <div className='navbar__item'>
        <Link to="/dashboard">Dashboard</Link>
        </div>
        <div className='navbar__item'>Marketplace</div>
        <div className='navbar__item'>Help</div>        
    </header>
    </div>
);


export default NavBar;