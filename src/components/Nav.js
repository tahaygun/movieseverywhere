import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
class Nav extends Component {
    render() {
        return (
            <ul className='padding0' >
                <li>
                    <NavLink
                    exact activeClassName="active" to="/"
                    > 
                    Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                    exact activeClassName="active" to="/bestmoviesofyear"
                    > 
                    Best Movies of Year
                    </NavLink>
                </li>
            </ul>
        );
    }
}

export default Nav;
