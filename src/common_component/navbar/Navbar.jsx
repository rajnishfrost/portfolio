import React, { useContext } from "react";
import Headroom from "react-headroom";
import "./Navbar.scss";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import StyleContext from "../../contexts/StyleContext";
import {
    greeting,
    skillsSection,
} from "../../portfolio";

function Navbar() {
    const { isDark } = useContext(StyleContext);
    const viewSkills = skillsSection.display;

    return (
        <Headroom>
            <header className={isDark ? "dark-menu header" : "header"}>
                <div className="d-flex">
                    <img src={require("../../assets/images/logo192.png")} alt="" />
                    <a href="/" className="logo ">
                        <span className={isDark ? "logo-name-dark" : "logo-name-white"}>{greeting.username}</span>
                    </a>
                </div>
                <input className="menu-btn" type="checkbox" id="menu-btn" />
                <label
                    className="menu-icon"
                    htmlFor="menu-btn"
                    style={{ color: "white" }}
                >
                    <span className={isDark ? "navicon navicon-dark" : "navicon"}></span>
                </label>
                <ul className={isDark ? "dark-menu menu" : "menu"}>

                    {viewSkills && (
                        <li>
                            <a href="#skills">Skills</a>
                        </li>
                    )}
                    <li>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a>
                            <ToggleSwitch />
                        </a>
                    </li>
                    <li>
                        <a href="#contact">Contact Me</a>
                    </li>
                </ul>
            </header>
        </Headroom>
    );
}
export default Navbar;
