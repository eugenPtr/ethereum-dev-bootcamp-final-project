import "./NavBar.css";
import { Link } from "react-router-dom";

const UnconnectedNavBar = () => (
    <div class="allNavBar">
    <header className='navbar'>
        <div className='navbar__title navbar__item'>
        <Link to="/">RMDAPP</Link></div>     
    </header>
    </div>
);


export default UnconnectedNavBar;