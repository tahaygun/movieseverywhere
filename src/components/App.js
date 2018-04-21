import React, { Component } from 'react';
import Nav from './Nav';
import Home from './Home';
import '../index.css';
import Moviesofyear from './Moviesofyear';
import { BrowserRouter, Route } from 'react-router-dom'
import {Switch} from 'react-router'; 
class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Nav/>
                    <Switch>
                    <Route  exact path="/" component={Home} />
                    <Route  exact path="/bestmoviesofyear" component={Moviesofyear} />
                    <Route component={()=>{
                        return(
                            <h3>404 not found, go play somewhere else dude..</h3>
                        )}} />
                    </Switch>
                </div>
             </BrowserRouter>
        );
    }
}

export default App;
