import React, { Component } from 'react';
import api from '../utils/api';
// import { Link } from "react-router-dom";

function Result(props) {
    return(
        <div className="resultContainer">
                <ul className="padding0" >
                    {props.data.map(function(movie) {
                        return(
                            <ul className="moviebox padding0" key={movie.id}>
                              <div className="movieboxDiv">
                                <div className="classDiv">
                                <li className="title" ><p className='titletext'>{movie.title}</p></li>
                                </div>
                                <li><a target="_blank" title={"Search on Google about '"+movie.title+"'"} href={"https://www.google.com/search?q="+movie.title}><img className="poster" src={'https://image.tmdb.org/t/p/w200/'+movie.poster_path} alt={movie.title}/></a></li>
                                <li> <button type="button" class="btn btn-warning btn-md">
                                  <b>{movie.vote_average} ★</b></button></li>
                                <li>Release Date: {movie.release_date} </li>
                                <li className="genresInBox" >{props.getGenre(movie.genre_ids)}</li>
                                <li className='overview' >{movie.overview} </li>
                                </div>
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
            result:null,
            genres: [
                {
                    "id": 28,
                    "name": "Action"
                  },
                  {
                    "id": 12,
                    "name": "Adventure"
                  },
                  {
                    "id": 16,
                    "name": "Animation"
                  },
                  {
                    "id": 35,
                    "name": "Comedy"
                  },
                  {
                    "id": 80,
                    "name": "Crime"
                  },
                  {
                    "id": 99,
                    "name": "Documentary"
                  },
                  {
                    "id": 18,
                    "name": "Drama"
                  },
                  {
                    "id": 10751,
                    "name": "Family"
                  },
                  {
                    "id": 14,
                    "name": "Fantasy"
                  },
                  {
                    "id": 36,
                    "name": "History"
                  },
                  {
                    "id": 27,
                    "name": "Horror"
                  },
                  {
                    "id": 10402,
                    "name": "Music"
                  },
                  {
                    "id": 9648,
                    "name": "Mystery"
                  },
                  {
                    "id": 10749,
                    "name": "Romance"
                  },
                  {
                    "id": 878,
                    "name": "Science Fiction"
                  },
                  {
                    "id": 10770,
                    "name": "TV Movie"
                  },
                  {
                    "id": 53,
                    "name": "Thriller"
                  },
                  {
                    "id": 10752,
                    "name": "War"
                  },
                  {
                    "id": 37,
                    "name": "Western"
                  }
              ]
        }
        this.changeYear = this.changeYear.bind(this);   
        this.getResults = this.getResults.bind(this);
        this.getGenre = this.getGenre.bind(this);
    }
    componentDidMount(){
        this.getResults();
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

    getGenre(array) {
        var result='';
        array.map(function(id){
          this.state.genres.map(function(genre){
          return  (genre.id=== id && (result += genre.name+' '))
          })
        }.bind(this))
        return result      
    }

    render() {
        var years = [];
        for(let i =2018; i>1950 ; i--){
            years.push(i)
        }
        return (
            <div>
                <div class="input-group">
                    <select  onChange={this.changeYear}  class="custom-select" id="inputGroupSelect04">
                    { years.map(function(year) {
                            return(
                            <option key={year} value={year}>{year}</option>
                        )
                        })}
                    </select>
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" onClick={this.getResults} type="button">Show</button>
                    </div>
                    </div>               
                {this.state.result!==null &&<Result getGenre={this.getGenre} data={this.state.result.data.results} />}
            </div>
        );
    }
}

export default Moviesofyear;
