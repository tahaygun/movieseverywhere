import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
class Nav extends Component {
    render() {
        return (
            <ul className='navButtons padding0' >
                <li>
                    <NavLink
                    end className={({ isActive }) => "btn btn-info" + (isActive ? " active" : "")} to="/"
                    >
                    Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                    end className={({ isActive }) => "btn btn-info" + (isActive ? " active" : "")} to="/bestmoviesofyear"
                    >
                    Best 20 Movies of Year
                    </NavLink>
                </li>
            </ul>
        );
    }
}

export default Nav;
