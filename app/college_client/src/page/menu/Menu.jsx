// Menu.js
import { Link } from "react-router-dom";
import { FaBook, FaUserPlus, FaCog } from "react-icons/fa"; // Import icons
import { CiCircleAlert } from "react-icons/ci";

import "./menu.css"; // Import the CSS file

function Menu() {
    return (
        <div className="menu-container">
            <Link to="/exam" className="menu-button">
                <FaBook className="icon" /> Exam
            </Link>
            <Link to="/alert" className="menu-button">
                <CiCircleAlert className="icon" /> Alert List
            </Link>
            <Link to="/create-user" className="menu-button">
                <FaUserPlus className="icon" /> Create User
            </Link>
            <Link to="/settings" className="menu-button">
                <FaCog className="icon" /> Settings
            </Link>
        </div>
    );
}

export default Menu;