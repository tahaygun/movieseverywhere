import React, { Component } from 'react';
import api from '../utils/api';

function Result(props) {
    return(
        <div className="resultContainer">
                <ul className="padding0" >
                    {props.data.map(function(movie) {
                        return(
                            <ul className="moviebox padding0" key={movie.id}>
                                <div className="classDiv">
                                <li className="title" >{movie.title}</li>
                                </div>
                                <li><a target="_blank" title={"Search on Google about '"+movie.title+"'"} href={"https://www.google.com/search?q="+movie.title}><img src={'https://image.tmdb.org/t/p/w200/'+movie.poster_path} alt={movie.title}/></a></li>
                                <li>{movie.vote_average} </li>
                                <li>{movie.release_date} </li>
                                <li className="genresInBox" >{props.getGenre(movie.genre_ids)}</li>
                                <li className='overview' >{movie.overview} </li>
                            </ul>
                        )
                    })}
                </ul>
        </div>
    )
}
//---------------------------------

function Filtering(props) {
  var genres = ["Action", "Adventure", "Animation" , "Comedy","Crime","Documentary","Drama","Family","Fantasy","History","Horror","Music", "Mystery","Romance","Science Fiction", "TV Movie","Thriller","War", "Western"];
  return(
   <div className="genresDiv" >
     <ul className="genresNav">
        {genres.map(function(genre) {
          return (
            <li  style = {genre === props.selectedGenre ? {color:'#d0021b'} :null }  onClick={props.changeGenre.bind(null,genre)}  key={genre}>{genre}</li>
          )
        })}
     </ul>
   </div>
  )
}



class Home extends Component {
    constructor(props) {
        super(props);
        this.state={
            movies:null,
            page:1,
            genre: null,
            genreName:null,
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
        this.getPopularMovies = this.getPopularMovies.bind(this);
        this.changePage = this.changePage.bind(this);
        this.getGenre = this.getGenre.bind(this);
        this.genreChanger = this.genreChanger.bind(this);
    }
    
     
    getGenre(array) {
        var result='';
        array.map(function(id){
          this.state.genres.map(function(genre){
            genre.id=== id && (result += genre.name+' ')
          })
        }.bind(this))
        return result      
    }


    componentDidMount(){
            this.getPopularMovies();
    }

    changePage(number){
        this.setState({
                page: this.state.page+number
            }, ()=>{this.getPopularMovies()}
        )
      
    }

    getPopularMovies(){
        api.getPopularMovies(this.state.page,this.state.genre).then(function(result) {
            this.setState(function() {
                return {
                    movies: result
                }
            })
        }.bind(this))
        
    }

    genreChanger(genre){

      this.state.genres.map(function(genres) {
        (genres.name===genre &&  this.setState({genre:genres.id, genreName:genre, page:1}, ()=>{this.getPopularMovies()}))
      }.bind(this))
    }


    render() {
        return (
            <div>
                <Filtering selectedGenre={this.state.genreName} changeGenre={this.genreChanger} />
               <h2 className="display-4" >The most popular movies:</h2> 
                <ul className="padding0">
                    {this.state.movies!==null &&<Result getGenre={this.getGenre} data={this.state.movies.data.results} />}
                </ul>
                <div className="pagination" >
                <p>Page {this.state.page}</p>
                {this.state.page>1&& <button className="btn btn-primary" onClick={this.changePage.bind(null,-1)} >Previus Page</button> } 
                {this.state.page>2 && <button className="btn btn-primary" onClick={this.changePage.bind(null,-[this.state.page-1])} >1</button> } 
                <button className="btn btn-primary"  onClick={this.changePage.bind(null,1)} >Next Page</button>
                </div>
            </div>
        );
    }
}

export default Home;
