import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
class Nav extends Component {
    render() {
        return (
            <ul className='navButtons padding0' >
                <li>
                    <NavLink
                    exact className="btn btn-info" activeClassName="active" to="/"
                    > 
                    Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                    exact className="btn btn-info" activeClassName="active" to="/bestmoviesofyear"
                    > 
                    Best 20 Movies of Year
                    </NavLink>
                </li>
            </ul>
        );
    }
}

export default Nav;
