import React, { Component } from 'react';
import api from '../utils/api';
// import { Link } from "react-router-dom";

function Result(props) {
    return(
        <div className="resultContainer">
                <ul className="padding0" >
                    {props.data.map(function(movie) {
                        return(
                            <ul className="moviebox" key={movie.id}>
                                <div className="classDiv">
                                <li className="title" >{movie.title}</li>
                                </div>
                                <li><a target="_blank" title={'Search on google: '+movie.title} href={"https://www.google.com/search?q="+movie.title}><img src={'https://image.tmdb.org/t/p/w200/'+movie.poster_path} alt={movie.title}/></a></li>
                                <li>{movie.vote_average} </li>
                                <li>{movie.release_date} </li>
                                <li className='overview' >{movie.overview} </li>
                            </ul>
                        )
                    })}
                </ul>
        </div>
    )
}


class Moviesofyear extends Component {
    constructor(props) {
        super(props);
        this.state={
            page:1,
            year:2018,
            result:null
        }
        this.changeYear = this.changeYear.bind(this);   
        this.getResults = this.getResults.bind(this);
    }
    

    getResults(event){
        api.getMoviesOfYear(this.state.year,1)
        .then(function(respond) {
            this.setState({result:respond , page:1})
        }.bind(this))
    }

    changeYear(event){
        var year= event.target.value;
        this.setState({year:year})
    }


    render() {
        var years = [];
        for(let i =2018; i>1950 ; i--){
            years.push(i)
        }
        return (
            <div>
                <form>
                    <select onChange={this.changeYear}  name="year" id="year">
                        { years.map(function(year) {
                            return(
                            <option key={year} value={year}>{year}</option>
                        )
                        })}
                    </select>
                </form>
                <button onClick={this.getResults}>Show</button>
                {this.state.result!==null &&<Result data={this.state.result.data.results} />}
            </div>
        );
    }
}

export default Moviesofyear;
