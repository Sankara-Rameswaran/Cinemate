import React from 'react';
import { Link } from 'react-router-dom';
import { IMG_POSTER } from '../tmdb';
export default function MovieCard({movie}){
  const poster = movie.poster_path ? IMG_POSTER+movie.poster_path : (movie.backdrop_path ? IMG_POSTER+movie.backdrop_path : (movie.poster ? movie.poster : ''));
  return (
    <Link to={'/movie/'+movie.id} style={{textDecoration:'none',color:'inherit'}}>
      <div className='card'>
        <img src={poster} alt='' className='poster' />
        <h4>{movie.title || movie.name}</h4>
        <div className='muted'>{movie.release_date ? movie.release_date.slice(0,4) : ''} • {movie.media_type || ''}</div>
      </div>
    </Link>
  )
}
